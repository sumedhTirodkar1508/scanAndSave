"use client";
import React, { Fragment, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import Link from "next/link";
// import { Plus, Minus } from "lucide-react";

const menus = [
  {
    id: 1,
    title: "Home",
    link: "/home",
    submenu: [
      {
        id: 11,
        title: "Home 1",
        link: "/home",
      },
      {
        id: 12,
        title: "Home 2",
        link: "/home-2",
      },
      {
        id: 13,
        title: "Home 3",
        link: "/home-3",
      },
      {
        id: 14,
        title: "Home 4",
        link: "/home-4",
      },
    ],
  },
  {
    id: 2,
    title: "About",
    link: "/about",
  },
  {
    id: 3,
    title: "Donations",
    link: "/donation-listing",
    submenu: [
      {
        id: 31,
        title: "Donations Listing",
        link: "/donation-listing",
      },
      {
        id: 32,
        title: "Donations Details",
        link: "/donation-details/Gift-an-Education-Make-a-Life-Better!",
      },
    ],
  },
  {
    id: 4,
    title: "Blog",
    link: "/blog",
    submenu: [
      {
        id: 41,
        title: "Blog",
        link: "/blog",
      },
      {
        id: 42,
        title: "Blog Details",
        link: "/blog-details/Start-a-fundraiser-for-yourself-in-World-Charity-Day",
      },
    ],
  },
  {
    id: 5,
    title: "Pages",
    link: "/events",
    submenu: [
      {
        id: 51,
        title: "Events",
        link: "/events",
      },
      {
        id: 52,
        title: "Event Single",
        link: "/event-single/The-Human-rights-and-democracy-programme",
      },
      {
        id: 51,
        title: "Service",
        link: "/service",
      },
      {
        id: 52,
        title: "Service Single",
        link: "/service-single/Study-&-Life-Tips",
      },
      {
        id: 53,
        title: "Shop",
        link: "/products",
      },
      {
        id: 54,
        title: "Shop Single",
        link: "/product-single/Yellow-Rocks-Umbrealla",
      },
      {
        id: 55,
        title: "Carts",
        link: "/cart",
      },
      {
        id: 56,
        title: "Checkout",
        link: "/checkout",
      },
      {
        id: 345,
        title: "Volunteers",
        link: "/volunteers",
      },
      {
        id: 3454,
        title: "Volunteer Single",
        link: "/team-single/Cameron-Williamson",
      },
    ],
  },
  {
    id: 88,
    title: "Contact",
    link: "/contact",
  },
];

const MobileMenu = () => {
  const [openId, setOpenId] = useState(0);

  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  return (
    <ul className="main_menu_list clearfix">
      {menus.map((item, mn) => {
        return (
          <ListItem className={item.id === openId ? "active" : null} key={mn}>
            {item.submenu ? (
              <Fragment>
                <p onClick={() => setOpenId(item.id === openId ? 0 : item.id)}>
                  {item.title}
                  {/* {item.id === openId ? (
                    <Minus className="icon-class" />
                  ) : (
                    <Plus className="icon-class" />
                  )} */}
                </p>
                <Collapse in={item.id === openId} timeout="auto" unmountOnExit>
                  <List className="subMenu">
                    <Fragment>
                      {item.submenu.map((submenu, i) => {
                        return (
                          <ListItem key={i}>
                            <Link
                              onClick={ClickHandler}
                              className="active"
                              href={submenu.link}
                            >
                              {submenu.title}
                            </Link>
                          </ListItem>
                        );
                      })}
                    </Fragment>
                  </List>
                </Collapse>
              </Fragment>
            ) : (
              <Link className="active" href={item.link}>
                {item.title}
              </Link>
            )}
          </ListItem>
        );
      })}
    </ul>
  );
};

export default MobileMenu;
