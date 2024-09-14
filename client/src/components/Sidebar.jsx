import React from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  DevicesOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FlexBetween from "./FlexBetween";
import profileImage from "../assets/malek.png";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
    path: "/dashboard",
  },
  {
    text: "Global",
    icon: null,
    path: "/global",
  },
  {
    text: "Nodes",
    icon: <DevicesOutlined />,
    path: "/products",
  },
  {
    text: "Datacenters",
    icon: <Groups2Outlined />,
    path: "/customers",
  },
  {
    text: "Configurations",
    icon: <ReceiptLongOutlined />,
    path: "/transactions",
  },
  {
    text: "Geography",
    icon: <PublicOutlined />,
    path: "/geography",
  },
  {
    text: "Informations",
    icon: null,
    path: "/informations",
  },
  {
    text: "Overview",
    icon: <PointOfSaleOutlined />,
    path: "/overview",
  },
  {
    text: "Daily",
    icon: <TodayOutlined />,
    path: "/daily",
  },
  {
    text: "Monthly",
    icon: <CalendarMonthOutlined />,
    path: "/monthly",
  },
  {
    text: "Breakdown",
    icon: <PieChartOutlined />,
    path: "/breakdown",
  },
  {
    text: "Management",
    icon: null,
    path: "/management",
  },
  {
    text: "Ask Questions",
    icon: <AdminPanelSettingsOutlined />,
    path: "/admin",
  },
  {
    text: "Performance",
    icon: <TrendingUpOutlined />,
    path: "/performance",
  },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="1rem">
                  <Typography variant="h4" fontWeight="bold">
                    Huawei Nodes
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>

            {/* Centered Profile Image */}
            <Box display="flex" justifyContent="center" mb="2rem">
              <img
                src={profileImage}
                alt="profile"
                width="60px"
                height="60px"
                style={{ borderRadius: "50%" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mb="2rem">
              Malek Abida
            </Box>
            <List>
              {navItems.map(({ text, icon, path }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(path);
                        setActive(path);
                      }}
                      sx={{
                        backgroundColor:
                          active === path
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === path
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === path
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === path && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
