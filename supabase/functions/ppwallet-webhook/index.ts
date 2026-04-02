// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const PPWALLET_WEBHOOK_SECRET = Deno.env.get("PPWALLET_WEBHOOK_SECRET") || "";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("x-webhook-signature") || "";

    // Verify HMAC signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(PPWALLET_WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const expectedSig = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (signature !== expectedSig) {
      console.error("PPWallet webhook: invalid signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 });
    }

    const payload = JSON.parse(body);
    const { event, code, status, externalOrderId } = payload;

    if (event !== "invoice.paid" || status !== "paid") {
      return new Response(JSON.stringify({ status: "ignored" }));
    }

    if (!externalOrderId) {
      return new Response(JSON.stringify({ error: "Missing externalOrderId" }), { status: 400 });
    }

    // Update order status in Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { error: updateError } = await supabase
      .from("order")
      .update({ status: "COMPLETED", completed_at: new Date().toISOString() })
      .eq("id", externalOrderId)
      .eq("status", "PROCESSING");

    if (updateError) {
      console.error("Failed to update order:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update order" }), { status: 500 });
    }

    console.log("PPWallet webhook: order updated", { orderId: externalOrderId, invoiceCode: code });
    return new Response(JSON.stringify({ status: "ok" }));
  } catch (err) {
    console.error("ppwallet-webhook error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
