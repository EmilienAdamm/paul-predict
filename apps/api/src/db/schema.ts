import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "finished",
  "cancelled",
]);

export const matches = pgTable(
  "matches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    externalId: text("external_id"),
    competition: text("competition").notNull(),
    homeTeam: text("home_team").notNull(),
    awayTeam: text("away_team").notNull(),
    kickoffAt: timestamp("kickoff_at", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
    status: matchStatusEnum("status").notNull().default("scheduled"),
    homeScore: integer("home_score"),
    awayScore: integer("away_score"),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("matches_external_id_idx").on(table.externalId),
    index("matches_kickoff_at_idx").on(table.kickoffAt),
    index("matches_status_idx").on(table.status),
  ],
);
