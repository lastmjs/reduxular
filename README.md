# reduxular

needed explanations:
  * Reduxular Element: put all state in store, class members aren't guaranteed to be initialized before state listeners are fired.
  * Initial state _must_ contain all state properties (type guards will prevent this if using TypeScript)
