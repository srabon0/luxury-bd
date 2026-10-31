import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <div className="site-topbar">
        <span>Bathroom & kitchen collections by Classic Group</span>
        <a href="tel:+8801711542678">Talk to us: +880 1711 542678</a>
      </div>
      <header className="site-header">
        <Link to="/" className="wordmark" aria-label="Luxurry home">
          Luxurry<span>THE EVERYDAY, ELEVATED</span>
        </Link>
        <button
          className="mobile-menu"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close ✕" : "Menu ☰"}
        </button>
        <nav
          id="main-navigation"
          className={open ? "site-nav is-open" : "site-nav"}
          aria-label="Main navigation"
        >
          {[
            ["/shop", "Collections"],
            ["/about", "Our story"],
            ["/contact", "Contact"],
          ].map(([url, label]) => (
            <NavLink key={url} to={url} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <form
          className="header-search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
            setOpen(false);
          }}
        >
          <input
            aria-label="Search collections"
            placeholder="Find your next detail…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button aria-label="Search products" type="submit">
            ↗
          </button>
        </form>
      </header>
    </>
  );
}
