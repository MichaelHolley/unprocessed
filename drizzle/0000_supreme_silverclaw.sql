CREATE TABLE `foods` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`emoji` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `impacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`food_id` text NOT NULL,
	`kind` text NOT NULL,
	`text` text NOT NULL,
	`position` integer NOT NULL,
	FOREIGN KEY (`food_id`) REFERENCES `foods`(`id`) ON UPDATE no action ON DELETE cascade
);
