CREATE TABLE `blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`target_id` text NOT NULL,
	`reason` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_block_owner_target` ON `blocks` (`account_id`,`target_id`);--> statement-breakpoint
CREATE TABLE `interests` (
	`id` text PRIMARY KEY NOT NULL,
	`initiator_id` text NOT NULL,
	`target_id` text NOT NULL,
	`intention` text NOT NULL,
	`mode` text NOT NULL,
	`state` text DEFAULT 'pending' NOT NULL,
	`initiator_approved` integer DEFAULT 1 NOT NULL,
	`target_approved` integer DEFAULT 0 NOT NULL,
	`simulated` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_interest_pair_mode` ON `interests` (`initiator_id`,`target_id`,`intention`,`mode`);--> statement-breakpoint
CREATE INDEX `idx_interest_target` ON `interests` (`target_id`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`account_id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`data` text NOT NULL,
	`settings` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_profile_id_unique` ON `profiles` (`profile_id`);--> statement-breakpoint
CREATE TABLE `scout_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`intention` text NOT NULL,
	`mode` text NOT NULL,
	`data` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_runs_account_created` ON `scout_runs` (`account_id`,`created_at`);