import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Collapse, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import Logo from "../../assets/images/TMS_LOGO.png";
import { PiBuildings } from "react-icons/pi";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { PiBookOpenText } from "react-icons/pi";
import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { TbUserSearch } from "react-icons/tb";
import { TbStatusChange } from "react-icons/tb";
import { TbCalendarTime } from "react-icons/tb";
import { TbFolderCog } from "react-icons/tb";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { VscReferences } from "react-icons/vsc";
import { BsFileEarmarkRichtext } from "react-icons/bs";
import { LiaUserEditSolid } from "react-icons/lia";
import { TbMessageCode } from "react-icons/tb";
import { GrUserSettings } from "react-icons/gr";
import { GiExitDoor } from "react-icons/gi";
import { MdOutlineAssignment } from "react-icons/md";
import { MdOutlineSettingsSuggest } from "react-icons/md";

const iconMapping = {
  "Centre Management": <PiBuildings />,
  "Configuration": <MdOutlineSettingsSuggest />,
  "Course Management": <PiBookOpenText />,
  "Lead Management": <GiExitDoor />,
};

function SuperAdminSidebar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation();
  const hasRenderedOnce = useRef(false);


  useEffect(() => {

    const updatedMenuItems = [
      {
        title: "Centre Management",
        icon: "PiBuildings",
        isOpen: false,
        subMenus: [
          {
            title: "Centre Listing",
            path: "/companyregistration",
            access: true,
          },
        ],
      },
      {
        title: "Configuration",
        icon: "MdOutlineSettingsSuggest ",
        isOpen: false,
        subMenus: [
          {
            title: "Configure",
            path: "/configuration",
            access: true,
          },
        ],
      },
    ];
    setMenuItems(updatedMenuItems);
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setMenuItems((menuItems) =>
        menuItems.map((item) => ({ ...item, isOpen: false }))
      );

      if (hasRenderedOnce.current) {
        setActiveMenu(null); // Only called after the first render
      } else {
        hasRenderedOnce.current = true; // Mark as rendered
      }
    }
  }, [location]);

  const handleMenuClick = (index) => {
    if (index === null) {
      // If Home is clicked, deactivate all menus
      setMenuItems(menuItems.map((item) => ({ ...item, isOpen: false })));
      setActiveMenu(null);
    } else {
      const updatedMenuItems = menuItems.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            isOpen: !item.isOpen,
          };
        } else {
          return {
            ...item,
            isOpen: false,
          };
        }
      });
      setMenuItems(updatedMenuItems);
      setActiveMenu(
        updatedMenuItems[index].isOpen ? updatedMenuItems[index].title : null
      );
    }
  };

  return (
    <div className="sidebar">
      <div className="logo-details">
        <span className="logo_name">
          <img src={Logo} alt="logo" width={70} className="img-fluid p-2" />
          <span className="text-dark">ECS School</span>
        </span>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            onClick={() => handleMenuClick(null)}
            className={activeMenu === true ? "active activehover" : ""}
          >
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id="home-tooltip">Home</Tooltip>}
            >
              <i className="homeIcons">
                <RiDashboardLine />
              </i>
            </OverlayTrigger>
            <span className="links_name text-center">&nbsp;Home</span>
          </NavLink>
        </li>
        {menuItems.map(
          (item, index) =>
            item.subMenus.some((subMenu) => subMenu.access) && (
              <li key={index}>
                <Nav.Link
                  to="#"
                  onClick={() => handleMenuClick(index)}
                  className={
                    activeMenu === item.title ? "active activehover" : ""
                  }
                >
                  <div
                    className="w-100 d-flex justify-content-between"
                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                  >
                    <span className="d-flex justify-content-center text-center">
                      <div className="text-center">
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip id={`${item.title}-tooltip`}>
                              {item.title}
                            </Tooltip>
                          }
                        >
                          {/* <span>
                              <i className={`${item.icon} activehover`}></i>
                            </span> */}
                          <span className="p-3">
                            {iconMapping[item.title] || "-"}
                          </span>
                        </OverlayTrigger>
                        <span className="links_name">{item.title}</span>
                      </div>
                    </span>
                    <span className="pe-4">
                      {item.isOpen ? (
                        <IoIosRemove
                          className="arrow open"
                          style={{
                            paddingRight: "5px",
                            minWidth: "0px",
                            fontWeight: "700",
                            fontSize: "24px",
                          }}
                        />
                      ) : (
                        <IoIosAdd
                          className="arrow"
                          style={{
                            paddingRight: "5px",
                            minWidth: "0px",
                            fontWeight: "700",
                            fontSize: "24px",
                          }}
                        />
                      )}
                    </span>
                  </div>
                </Nav.Link>

                <Collapse in={item.isOpen}>
                  <ul className="submenu">
                    {item.subMenus.map(
                      (subMenu, subIndex) =>
                        subMenu.access && (
                          <li key={subIndex}>
                            <NavLink
                              to={subMenu.path}
                              className={({ isActive }) =>
                                isActive ? "active-submenu" : ""
                              }
                            >
                              <OverlayTrigger
                                placement="right"
                                overlay={
                                  <Tooltip id={`${subMenu.title}-tooltip`}>
                                    {subMenu.title}
                                  </Tooltip>
                                }
                              >
                                <i
                                  className="bx bx-radio-circle-marked"
                                  style={{ fontWeight: "400" }}
                                ></i>
                                {/* <BiRadioCircleMarked className=""/> */}
                              </OverlayTrigger>
                              <span className="links_name links_names active">
                                {subMenu.title}
                              </span>
                            </NavLink>
                          </li>
                        )
                    )}
                  </ul>
                </Collapse>
              </li>
            )
        )}
      </ul>
    </div>
  );
}

export default SuperAdminSidebar;
