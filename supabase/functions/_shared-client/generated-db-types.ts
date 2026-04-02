export type bigserialnum = number & { _type: "bigserial" }
export type smallserialnum = number & { _type: "smallserial" }
export type serialnum = number & { _type: "serial" }

export type smallintnum = number & { _type: "smallint" }
export type intnum = number & { _type: "int" }
export type bigintnum = number & { _type: "bigint" }
export type floatnum = number & { _type: "real" }
export type doublenum = number & { _type: "double" }
export type moneynum = number & { _type: "money" }

export type byteastr = string & { _type: "bytea" }
export type bpcharstr = string & { _type: "bpchar" }
export type varcharstr = string & { _type: "varchar" }
export type datestr = string & { _type: "date" }
// case insensitive text
export type citextstr = string & { _type: "citext" }
// time without timezone
export type timestr = string & { _type: "time" }
// time with timezone
export type timetzstr = string & { _type: "timetz" }
// timestamp without timezone
export type timestampstr = string & { _type: "timestamp" }
// timestamp with timezone
export type timestamptzstr = string & { _type: "timestamptz" }
export type uuidstr = string & { _type: "uuid" }
export type vectorstr = string & { _type: "vector" }

export type emailstr = string & { _type: "email" }
export type urlstr = string & { _type: "url" }

export const toBigSerialNum = (n: number): bigserialnum => n as bigserialnum
export const toSmallSerialNum = (n: number): smallserialnum =>
  n as smallserialnum
export const toSerialNum = (n: number): serialnum => n as serialnum

export const toSmallIntNum = (n: number): smallintnum => n as smallintnum
export const toIntNum = (n: number): intnum => n as intnum
export const toBigIntNum = (n: number): bigintnum => n as bigintnum
export const toFloatNum = (n: number): floatnum => n as floatnum
export const toDoubleNum = (n: number): doublenum => n as doublenum
export const toMoneyNum = (n: number): moneynum => n as moneynum

export const toByteaStr = (s: string): byteastr => s as byteastr
export const toBpcharStr = (s: string): bpcharstr => s as bpcharstr
export const toVarcharStr = (s: string): varcharstr => s as varcharstr
export const toDateStr = (s: string): datestr => s as datestr
export const toCitextStr = (s: string): citextstr => s as citextstr
export const toTimeStr = (s: string): timestr => s as timestr
export const toTimetzStr = (s: string): timetzstr => s as timetzstr
export const toTimestampStr = (s: string): timestampstr => s as timestampstr
export const toTimestamptzStr = (s: string): timestamptzstr =>
  s as timestamptzstr
export const toUuidStr = (s: string): uuidstr => s as uuidstr
export const toVectorStr = (s: string): vectorstr => s as vectorstr

export const toEmailStr = (s: string): emailstr => s as emailstr
export const toUrlStr = (s: string): urlstr => s as urlstr

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enum exports
export type EntityType = "PERSON" | "SYSTEM" | "BOT"

export type GameCategory = "MOBILE" | "PC" | "CONSOLE" | "GIFT_CARD" | "PREMIUM"

export type GenderType = "MALE" | "FEMALE" | "NON_BINARY"

export type OrderStatus = "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED"

export type PackageType = "CURRENCY" | "PASS" | "BUNDLE"

export type PaymentMethod =
  | "CARD"
  | "E_WALLET"
  | "TELEGRAM_PAYMENT"
  | "CRYPTO"
  | "PPWALLET"

// Composite Type exports
export type AssetV1 = {
  id: uuidstr
  bucketId: string | null
  name: string | null
  ownerId: string | null
  mimeType: string | null
}

export type EntityV1 = {
  id: uuidstr
  createdAt: timestamptzstr
  updatedAt: timestamptzstr
  entityType: EntityType | null
  userId: uuidstr | null
  name: string | null
}

export type GameV1 = {
  id: uuidstr
  createdAt: timestamptzstr
  updatedAt: timestamptzstr
  name: string
  iconUrl: string
  bannerUrl: string | null
  description: string | null
  category: GameCategory | null
  platforms: string[] | null
  requiresPlayerId: boolean
  playerIdLabel: string | null
  playerIdHelp: string | null
  requiresServer: boolean
  servers: string[] | null
  startingPriceInUsd: number | null
  isPopular: boolean
  isNew: boolean
}

export type OrderV1 = {
  id: uuidstr
  createdAt: timestamptzstr
  userId: uuidstr
  gameId: uuidstr
  gameName: string
  gameIconUrl: string
  packageId: uuidstr
  packageName: string
  playerId: string | null
  server: string | null
  amountInUsd: number
  discountInUsd: number
  promoCode: string | null
  paymentMethod: PaymentMethod | null
  status: OrderStatus | null
  completedAt: timestamptzstr | null
  estimatedDeliveryInMin: intnum
}

export type PackageV1 = {
  id: uuidstr
  createdAt: timestamptzstr
  updatedAt: timestamptzstr
  gameId: uuidstr
  name: string
  description: string | null
  type: PackageType | null
  quantity: intnum | null
  priceInUsd: number
  originalPriceInUsd: number | null
  isPromotion: boolean
  promotionText: string | null
}

export type ProfileUpdateV1 = {
  updatedAt: timestamptzstr | null
  username: string | null
  fullName: string | null
  avatarUrl: string | null
  gender: GenderType | null
  givenName: string | null
  familyName: string | null
  birthDate: datestr | null
}

export type ProfileV1 = {
  id: uuidstr
  createdAt: timestamptzstr
  updatedAt: timestamptzstr
  username: string | null
  fullName: string | null
  avatarUrl: string | null
  gender: GenderType | null
  givenName: string | null
  familyName: string | null
  birthDate: datestr | null
}

export type ProfileWithEmailV1 = {
  profile: ProfileV1 | null
  email: emailstr | null
}

export type PromoCodeV1 = {
  id: uuidstr
  createdAt: timestamptzstr
  code: string
  discountPercent: intnum
  isActive: boolean
  validFrom: timestamptzstr | null
  validUntil: timestamptzstr | null
}

export type SavedGameAccountV1 = {
  id: uuidstr
  userId: uuidstr
  gameId: uuidstr
  playerId: string
  server: string | null
  nickname: string | null
  createdAt: timestamptzstr
  updatedAt: timestamptzstr
  game: GameV1 | null
}

export type UserAppProfileV1 = {
  id: uuidstr
  createdAt: timestamptzstr
  updatedAt: timestamptzstr
  isOnboardingComplete: boolean
  telegramUserId: string | null
  totalOrdersCount: intnum
  totalSpentInUsd: number
}

export type UserPreferenceV1 = {
  id: uuidstr
  createdAt: timestamptzstr
  updatedAt: timestamptzstr
  favoriteGameIds: uuidstr[] | null
}

export type UserV1 = {
  id: uuidstr
  email: emailstr | null
  role: varcharstr | null
  emailConfirmedAt: timestamptzstr | null
  lastSignInAt: timestamptzstr | null
  createdAt: timestamptzstr | null
  updatedAt: timestamptzstr | null
  phone: string | null
  isSsoUser: boolean
  deletedAt: timestamptzstr | null
}

export type Database = {
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      "admin:assets:user:read": {
        Args: { ownerId: uuidstr | null }
        Returns: AssetV1[]
      }
      "admin:entity:getByEmail": {
        Args: { userEmail: string | null }
        Returns: {
          entityId: uuidstr
          email: string
        }[]
      }
      "admin:user:deleteRelatedData": {
        Args: { userId: uuidstr | null }
        Returns: undefined
      }
      "admin:userApp:setTelegramUserId": {
        Args: { userId: uuidstr | null; telegramUserId: string | null }
        Returns: undefined
      }
      "app:assets:user:read": {
        Args: Record<PropertyKey, never>
        Returns: AssetV1[]
      }
      "app:entity:exists": {
        Args: { entityId: uuidstr | null }
        Returns: boolean
      }
      "app:entity:user:create": {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      "app:entity:user:read": {
        Args: Record<PropertyKey, never>
        Returns: EntityV1
      }
      "app:entity:user:update": {
        Args: { newEntityType?: EntityType | null; newName?: string | null }
        Returns: boolean
      }
      "app:game:package:read": {
        Args: { packageId: uuidstr | null }
        Returns: PackageV1
      }
      "app:game:package:readAll": {
        Args: { gameId: uuidstr | null }
        Returns: PackageV1[]
      }
      "app:game:read": {
        Args: { gameId: uuidstr | null }
        Returns: GameV1
      }
      "app:game:readAll": {
        Args: Record<PropertyKey, never>
        Returns: GameV1[]
      }
      "app:order:create": {
        Args: {
          gameId: uuidstr | null
          gameName: string | null
          gameIconUrl: string | null
          packageId: uuidstr | null
          packageName: string | null
          playerId?: string | null
          server?: string | null
          amountInUsd?: number | null
          discountInUsd?: number | null
          promoCode?: string | null
          paymentMethod?: PaymentMethod | null
          estimatedDeliveryInMin?: intnum | null
        }
        Returns: OrderV1
      }
      "app:order:read": {
        Args: { orderId: uuidstr | null }
        Returns: OrderV1
      }
      "app:order:readAll": {
        Args: Record<PropertyKey, never>
        Returns: OrderV1[]
      }
      "app:profile:user:read": {
        Args: Record<PropertyKey, never>
        Returns: ProfileV1
      }
      "app:profile:user:readWithEmail": {
        Args: Record<PropertyKey, never>
        Returns: ProfileWithEmailV1
      }
      "app:profile:user:update": {
        Args: {
          avatarUrl?: string | null
          username?: string | null
          fullName?: string | null
          givenName?: string | null
          familyName?: string | null
          birthDate?: datestr | null
          gender?: GenderType | null
          updatedAt?: timestamptzstr | null
        }
        Returns: ProfileV1
      }
      "app:promo:validate": {
        Args: { promoCode: string | null }
        Returns: PromoCodeV1
      }
      "app:userApp:preference:read": {
        Args: Record<PropertyKey, never>
        Returns: UserPreferenceV1
      }
      "app:userApp:preference:update": {
        Args: { favoriteGameIds?: uuidstr[] | null }
        Returns: UserPreferenceV1
      }
      "app:userApp:profile:read": {
        Args: Record<PropertyKey, never>
        Returns: UserAppProfileV1
      }
      "app:userApp:profile:update": {
        Args: {
          isOnboardingComplete?: boolean | null
          telegramUserId?: string | null
        }
        Returns: UserAppProfileV1
      }
      "app:userApp:savedAccount:delete": {
        Args: { savedAccountId: uuidstr | null }
        Returns: undefined
      }
      "app:userApp:savedAccount:readAll": {
        Args: Record<PropertyKey, never>
        Returns: SavedGameAccountV1[]
      }
      "app:userApp:savedAccount:upsert": {
        Args: {
          gameId: uuidstr | null
          playerId: string | null
          server?: string | null
          nickname?: string | null
        }
        Returns: SavedGameAccountV1
      }
      int_id_from_millis: {
        Args: { millis_since_1970: bigintnum | null }
        Returns: intnum
      }
      int_id_from_timestamp: {
        Args: { ts?: timestamptzstr | null }
        Returns: intnum
      }
      uuid_add_millis_and_id: {
        Args: {
          uuid1: uuidstr | null
          millis_since1970?: bigintnum | null
          uuid2?: uuidstr | null
        }
        Returns: uuidstr
      }
      uuid_add_timestamp_and_id: {
        Args: {
          uuid1: uuidstr | null
          ts?: timestamptzstr | null
          uuid2?: uuidstr | null
        }
        Returns: uuidstr
      }
      uuid_at: {
        Args: { time_id: bigintnum | null; space_id?: bigintnum | null }
        Returns: uuidstr
      }
      uuid_from_base64: {
        Args: { uuid_base64: string | null }
        Returns: uuidstr
      }
      uuid_from_longs: {
        Args: { msb: bigintnum | null; lsb: bigintnum | null }
        Returns: uuidstr
      }
      uuid_from_millis: {
        Args: { millis_since_1970: bigintnum | null; uuid1: uuidstr | null }
        Returns: uuidstr
      }
      uuid_from_timestamp: {
        Args: { ts?: timestamptzstr | null; uuid1?: uuidstr | null }
        Returns: uuidstr
      }
      uuid_to_base64: {
        Args: { uuid1: uuidstr | null }
        Returns: string
      }
      uuid_to_millis: {
        Args: { uuid1: uuidstr | null }
        Returns: bigintnum
      }
    }
    Enums: {
      entity_type: EntityType
      game_category: GameCategory
      gender_type: GenderType
      order_status: OrderStatus
      package_type: PackageType
      payment_method: PaymentMethod
    }
    CompositeTypes: {
      AssetV1: AssetV1
      EntityV1: EntityV1
      GameV1: GameV1
      OrderV1: OrderV1
      PackageV1: PackageV1
      ProfileUpdateV1: ProfileUpdateV1
      ProfileV1: ProfileV1
      ProfileWithEmailV1: ProfileWithEmailV1
      PromoCodeV1: PromoCodeV1
      SavedGameAccountV1: SavedGameAccountV1
      UserAppProfileV1: UserAppProfileV1
      UserPreferenceV1: UserPreferenceV1
      UserV1: UserV1
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      entity_type: ["PERSON", "SYSTEM", "BOT"],
      game_category: ["MOBILE", "PC", "CONSOLE", "GIFT_CARD", "PREMIUM"],
      gender_type: ["MALE", "FEMALE", "NON_BINARY"],
      order_status: ["PROCESSING", "COMPLETED", "FAILED", "REFUNDED"],
      package_type: ["CURRENCY", "PASS", "BUNDLE"],
      payment_method: [
        "CARD",
        "E_WALLET",
        "TELEGRAM_PAYMENT",
        "CRYPTO",
        "PPWALLET",
      ],
    },
  },
} as const
