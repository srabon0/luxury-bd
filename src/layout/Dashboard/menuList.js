import {
  AdjustmentsHorizontalIcon,
  BellSnoozeIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  CubeTransparentIcon,
  HomeIcon,
  PlusCircleIcon,
  TagIcon,
} from "@heroicons/react/24/solid";

export const dashboardMenuList = [
  {
    id: 1000,
    name: "Products",
    link: "/dashboard/products",
    icon: <CubeTransparentIcon className="w-6 h-6" />,
  },
  {
    id: 1001,
    name: "Add Product",
    link: "/dashboard/add-product",
    icon: <PlusCircleIcon className="w-6 h-6" />,
  },
  {
    id: 1002,
    name: "Categories",
    link: "/dashboard/categories",
    icon: <TagIcon className="w-6 h-6" />,
  },
  {
    id: 1003,
    name: "Brands",
    link: "/dashboard/brands",
    icon: <AdjustmentsHorizontalIcon className="w-6 h-6" />,
  },
  {
    id: 1004,
    name: "Orders",
    link: "/dashboard/orders",
    icon: <BellSnoozeIcon className="w-6 h-6" />,
  },
  {
    id: 1005,
    name: "Payment",
    link: "/dashboard/payment",
    icon: <CreditCardIcon className="w-6 h-6" />,
  },
  {
    id: 1006,
    name: "Settings",
    link: "/dashboard/settings",
    icon: <Cog6ToothIcon className="w-6 h-6" />,
  },
  {
    id: 1007,
    name: "Back to Home",
    link: "/",
    icon: <HomeIcon className="w-6 h-6" />,
  },
];
