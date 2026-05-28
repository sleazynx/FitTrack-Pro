import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Dumbbell, Utensils, TrendingUp, User } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/workout', label: 'Workout', icon: Dumbbell },
  { path: '/nutrition', label: 'Nutrition', icon: Utensils },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-[100dvh] bg-background overflow-hidden">
      {/* Main content */}
      <main className="flex-1 overflow-y-auto ios-scroll">
        <Outlet />
      </main>

      {/* Bottom tab bar */}
      <nav className="bg-card/90 backdrop-blur-xl border-t border-border flex-shrink-0 safe-bottom">
        <div className="flex items-stretch h-16">
          {tabs.map(({ path, label, icon: Icon }) => {
            const isActive = path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 tap-scale"
              >
                <motion.div
                  animate={{ scale: isActive ? 1 : 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 -m-1.5 rounded-xl bg-primary/10"
                    />
                  )}
                  <Icon
                    size={22}
                    className={`relative ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </motion.div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}