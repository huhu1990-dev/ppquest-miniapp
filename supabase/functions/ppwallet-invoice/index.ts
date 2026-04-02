// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PPWALLET_API_URL = Deno.env.get("PPWALLET_API_URL") || "https://wallet.ppquest.com";
const PPWALLET_API_KEY = Deno.env.get("PPWALLET_API_KEY") || "";
const PPWALLET_API_SECRET = Deno.env.get("PPWALLET_API_SECRET") || "";
const PPWALLET_WEBHOOK_URL = Deno.env.get("PPWALLET_WEBHOOK_URL") || "";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { orderId, amountThb, description } = await req.json();

    if (!orderId || !amountThb) {
      return new Response(
        JSON.stringify({ error: "orderId and amountThb required" }),
        { status: 400 }
      );
    }

    // Create invoice on PPWallet API
    const invoiceRes = await fetch(`${PPWALLET_API_URL}/api/invoice/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PPWALLET_API_KEY}:${PPWALLET_API_SECRET}`,
      },
      body: JSON.stringify({
        amountThb: Number(amountThb),
        description: description || "PPQuest Top-Up",
        callbackUrl: PPWALLET_WEBHOOK_URL,
        externalOrderId: orderId,
        idempotencyKey: `ppquest_woz_${orderId}`,
      }),
    });

    if (!invoiceRes.ok) {
      const err = await invoiceRes.json().catch(() => ({ error: "Unknown" }));
      console.error("PPWallet invoice creation failed:", err);
      return new Response(
        JSON.stringify({ error: "Failed to create invoice" }),
        { status: 502 }
      );
    }

    const invoice = await invoiceRes.json();

    return new Response(
      JSON.stringify({
        payUrl: invoice.payUrl,
        invoiceCode: invoice.code,
        expiresAt: invoice.expiresAt,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("ppwallet-invoice error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500 }
    );
  }
});
