import React from "react";
import { Link } from "react-router-dom";
const Footer = () => (
  <footer className="border-t border-gray-200 mt-12 py-8 flex flex-wrap items-center justify-between gap-6">
    <div><p className="font-bold tracking-widest">LUXURRY</p><p className="text-sm text-gray-500 mt-2">Bathroom & kitchen collections · Classic Group</p></div>
    <nav aria-label="Footer"><Link className="text-sm underline" to="/shop">Browse the collection</Link></nav>
    <p className="text-xs text-gray-500">© {new Date().getFullYear()} Classic Group. All rights reserved.</p>
  </footer>
);
export default Footer;
