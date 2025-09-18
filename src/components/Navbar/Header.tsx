"use client";

import * as React from "react";
import {
  MdSearch,
  MdNotifications,
  MdMessage,
  MdPerson,
  MdSettings,
  MdCreditCard,
  MdLogout,
  MdMenu,
} from "react-icons/md";

// Custom Header Component
function Header() {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [messagesOpen, setMessagesOpen] = React.useState(false);
  const [userMenuOpen, setMdPersonMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4">
      {/* Left side - Sidebar trigger and separator */}
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Center search bar with responsive width */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
        <div className="relative">
          <MdSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="MdSearch..."
            className="w-[280px] rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent lg:w-[320px] xl:w-[400px]"
          />
        </div>
      </div>

      {/* Mobile search - shown only on small screens */}
      <div className="relative md:hidden flex-1 mx-4">
        <MdSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          placeholder="MdSearch..."
          className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Right side - Notifications, Messages, Theme, MdPerson Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <MdNotifications className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
              <div className="p-4">
                <div className="text-sm font-medium mb-3">Notifications</div>
                <div className="border-t border-slate-200 dark:border-slate-700" />
                <div className="space-y-2 mt-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex flex-col items-start py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md px-2"
                    >
                      <div className="flex w-full justify-between">
                        <span className="font-medium text-sm">New comment</span>
                        <span className="text-xs text-slate-500">1h ago</span>
                      </div>
                      <span className="text-sm text-slate-500">
                        John Doe commented on your post
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 mt-2" />
                <button className="w-full text-center py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Messages Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMessagesOpen(!messagesOpen)}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <MdMessage className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
              5
            </span>
          </button>

          {messagesOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
              <div className="p-4">
                <div className="text-sm font-medium mb-3">Recent Messages</div>
                <div className="border-t border-slate-200 dark:border-slate-700" />
                <div className="space-y-2 mt-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md px-2"
                    >
                      <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <MdPerson className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">
                            Jane Smith
                          </span>
                          <span className="text-xs text-slate-500">2h ago</span>
                        </div>
                        <span className="text-sm text-slate-500">
                          Hey, can we meet tomorrow?
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 mt-2" />
                <button className="w-full text-center py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md">
                  View all messages
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

        {/* Theme Switch - Placeholder */}
        <ThemeSwitch />

        {/* MdPerson Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMdPersonMenuOpen(!userMenuOpen)}
            className="relative h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <MdPerson className="h-4 w-4" />
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <div className="flex flex-col space-y-1 px-2 py-1.5">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-slate-500">john.doe@example.com</p>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

                <div className="space-y-1">
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <MdPerson className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <MdSettings className="h-4 w-4" />
                    <span>MdSettings</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <MdCreditCard className="h-4 w-4" />
                    <span>Billing</span>
                  </button>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

                <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <MdLogout className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Import the useSidebarContext from CustomSidebar
import { useSidebarContext } from "../Sidebar/Sidebar";
import ThemeSwitch from "../Theme/ThemeSwitcher";

// Sidebar Trigger Component (imported from CustomSidebar)
function SidebarTrigger() {
  const { toggleSidebar } = useSidebarContext();

  return (
    <button
      onClick={toggleSidebar}
      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
    >
      <MdMenu className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

export { Header };
