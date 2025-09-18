"use client";

import * as React from "react";
import {
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

      {/* Center search bar for desktop */}
      <div className="hidden flex-1 items-center justify-center md:flex">
        <SearchBar showSuggestions className="max-w-xl" />
      </div>

      {/* Right side - Notifications, Messages, Theme, MdPerson Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile search dialog */}
        <div className="md:hidden">
          <SearchDialog />
        </div>
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <MdNotifications className="text-slate-900 dark:text-slate-100 h-5 w-5" />
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
            <MdMessage className=" text-slate-900 dark:text-slate-100 h-5 w-5" />
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
              <MdPerson className="h-4 w-4 text-slate-900 dark:text-slate-100" />
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <div className="flex flex-col space-y-1 px-2 py-1.5">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    John Doe
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    john.doe@example.com
                  </p>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

                <div className="space-y-1">
                  <button className="flex w-full items-center gap-2 text-slate-900 dark:text-slate-100 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <MdPerson className="h-4 w-4 text-slate-900 dark:text-slate-100" />
                    <span>Profile</span>
                  </button>
                  <button className="flex w-full items-center text-slate-900 dark:text-slate-100 gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <MdSettings className="h-4 w-4" />
                    <span>MdSettings</span>
                  </button>
                  <button className="flex w-full items-center text-slate-900 dark:text-slate-100 gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <MdCreditCard className="h-4 w-4" />
                    <span>Billing</span>
                  </button>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 my-2" />

                <button className="flex w-full items-center text-slate-900 dark:text-slate-100 gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
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
import { SearchBar } from "./SearchBar";
import { SearchDialog } from "./SearchDialog";

// Sidebar Trigger Component (imported from CustomSidebar)
function SidebarTrigger() {
  const { toggleSidebar } = useSidebarContext();

  return (
    <button
      onClick={toggleSidebar}
      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
    >
      <MdMenu className="h-4 w-4 text-slate-900 dark:text-slate-100" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

export { Header };
