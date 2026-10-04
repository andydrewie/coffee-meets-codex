CREATE TABLE `scout_usage` (
	`id` text PRIMARY KEY NOT NULL,
	`account_key` text NOT NULL,
	`day` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_scout_usage_account_day` ON `scout_usage` (`account_key`,`day`);--> statement-breakpoint
CREATE INDEX `idx_scout_usage_day` ON `scout_usage` (`day`);