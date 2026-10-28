<?php
namespace App\Enums;
enum Role: string {
    case Admin = 'admin';
    case CatalogManager = 'catalog_manager';
    case SR = 'sr';
    public function managesCatalog(): bool { return in_array($this, [self::Admin, self::CatalogManager], true); }
}
