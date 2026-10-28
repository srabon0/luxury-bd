# Permission contract

| Action | Public | SR | Catalog Manager | Admin |
|---|---|---|---|---|
| Published products and specs | Yes | Yes | Yes | Yes |
| Internal prices | No | Yes | Yes | Yes |
| Draft products | No | Yes | Yes | Yes |
| Create/update/delete products and images | No | No | Yes | Yes |
| Create/update/delete categories | No | No | Yes | Yes |
| Set internal prices | No | No | Yes | Yes |
| Create staff / assign roles / activate accounts | No | No | No | Yes |

All staff permissions require active session authentication. Role checks run on the
server, independently of buttons. Catalog Manager is the working name for role 2.
No public endpoint loads or serializes the price relation. Form fields, URLs and
public JavaScript do not contain private prices. Admin cannot demote/deactivate the
last active administrator. Future CMS capabilities and audit logs remain planned.
