# Laravel design review — 28 October 2026

These screenshots show the Laravel Blade templates rendered in CI with disposable
sample catalog records and a fictional administrator. They are not captures of
the production website. Product photos are placeholders until real catalog uploads.
No review account is created in the application seeder.

- [Homepage](home.jpg): original video, deep indigo and Classic Group endorsement.
- [Contact](contact.jpg): product name/code prefill, no public price.
- [Mobile](mobile.jpg): 390 px homepage/catalog and 320 px contact frame review.
- [Staff workspace](workspace.jpg): fictional internal prices and management controls.

Browser review verified desktop layouts, narrow homepage/contact without horizontal
overflow, and three-product comparison selection/limit feedback. Screenshots were
taken from isolated CI-rendered static HTML; form submission and authenticated
sessions were validated by PHP feature tests, not this static browser snapshot.
This snapshot does not prove cPanel runtime performance or email delivery.

Source validation: PHP 8.4 with SQLite and MariaDB 10.6; 13 PHP tests and 102
assertions in each job, five JavaScript interaction/video tests, PHP syntax,
Composer metadata/security audit and production cache compilation.
CI: https://github.com/srabon0/luxury-bd/actions/runs/40744906127

Before production: real product content/images, full content/settings requirements,
password recovery, audit/backup/release work, cPanel staging configuration, SMTP
delivery verification, measured performance and rollback verification.
