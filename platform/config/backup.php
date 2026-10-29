<?php
return [
    'enabled'=>(bool)env('BACKUPS_ENABLED',false),
    'directory'=>env('BACKUP_DIRECTORY',storage_path('app/private/backups')),
    'keep_days'=>(int)env('BACKUP_KEEP_DAYS',7),
    'mysqldump'=>env('MYSQLDUMP_BINARY','mysqldump'),
    'tar'=>env('TAR_BINARY','tar'),
];
