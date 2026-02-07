# 📱 Expanded Mobile UI/UX Analysis: All Modules

**Status:** 🚨 CRITICAL UX FAILURES across all tabs
**Scope:** Finance, Calendar (Agenda), Tasks (Afazeres)

---

## 📅 Calendar (Agenda) Analysis
**Current State:** Desktop Grid forced into Mobile View.

### 1. View Toggle & Controls (`CalendarAgenda.css`)
*   **Problem:** The control bar stacks vertically (`flex-direction: column` in media query).
*   **Result:** The "Previous/Next Week" buttons, Date Range, and View Toggle buttons form a massive block at the top, pushing the calendar off-screen.
*   **UX Fail:** Navigating weeks requires thumb-stretching to the top of the screen.

### 2. Time Grid (The "Unreadable Mesh")
*   **Problem:** The 7-column grid squashes days into ~40-50px width columns on mobile.
*   **Readability:** Events with titles longer than 4 characters will be truncated or overflow.
*   **Touch Targets:** Tapping a specific hour slot in a tiny column is nearly impossible for users with average-sized fingers.

### 3. Event Modal
*   **Problem:** The modal uses `width: 90%` but lacks proper height management for mobile keyboards.
*   **Input Blocking:** Opening the keyboard to type an event title will likely cover the "Save" button or the time inputs.

### **🚀 Recommendation:**
*   **Force "Agenda View" (List) on Mobile:** Do not show the 7-day time grid. Show a daily list or a 3-day view max.
*   **Stack Navigation:** Move "Week" navigation to a swipe gesture on the list itself.

---

## ✅ Tasks (Afazeres) Analysis
**Current State:** 2-Column Kanban squashed into a single vertical stack.

### 1. Kanban Columns
*   **Problem:** On mobile (`max-width: 768px`), grid layout switches to 1 column.
*   **Result:** Users see the "To Do" list first. To see "Done", they must scroll past *all* active tasks. If you have 50 tasks, you never see the "Done" column.
*   **UX Fail:** No quick way to switch between "Active" and "Completed".

### 2. Task Cards
*   **Touch Targets:** The "Edit" and "Delete" icons appear on hover (Desktop pattern). On mobile, "hover" is buggy or nonexistent.
*   **Interaction:** Users cannot easily delete a task without tapping it first (if click triggers edit).
*   **Missing Gestures:** No swipe-to-complete or swipe-to-delete.

### 3. Filtering
*   **Problem:** The date filter and "New Task" button are at the top, competing for space.
*   **Visual Clutter:** The "Filter by Date" input is standard browser UI, which looks broken on iOS dark mode often.

### **🚀 Recommendation:**
*   **Tabbed View:** Instead of stacking columns, use a refined "Tab Switcher" for [To Do] | [Done].
*   **Swipe Gestures:** Implement swipe actions for valid mobile interaction.

---

## 💰 (Recap) Financial Dashboard Analysis
*   **Layout:** Stacks linearly, burying content.
*   **Filters:** Occupy 50% of screen height.
*   **Charts:** Compression makes legends and slices untappable.

---

## 🏁 Unified Mobile Refactor Plan

We will adopt a **"Mobile-Specific Navigation"** strategy for internal tab content.

### Phase 1: Global Containers
1.  **Bottom Navigation:** Ensure distinct active states and sufficient padding.
2.  **Header Standardization:** Create a unified Mobile Header component that handles "Page Title" and "Primary Action (FAB)".

### Phase 2: Component Adaptation
| Module | Desktop Pattern | Mobile Pattern |
| :--- | :--- | :--- |
| **Finance** | Grid + Sidebar Filters | Carousel Cards + Bottom Sheet Filters |
| **Calendar** | Weekly Time Grid | Daily Schedule List (Agenda View) |
| **Tasks** | 2-Column Kanban | Tabbed List (Active / Done) with Swipe |

### Phase 3: Interaction
*   **FAB (Floating Action Button):** The primary action for *every* screen (New Transaction, New Event, New Task) moves to a fixed FAB at bottom-right.
*   **Gestures:** Enable horizontal swipes for lists (Transactions, Tasks).

---

**Ready to start executing the "Mobile-First" refactor across all 3 modules?**
