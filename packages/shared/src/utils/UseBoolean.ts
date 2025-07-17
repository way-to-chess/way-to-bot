import { useMemo, useState } from "react";

const useBoolean = (defaultValue = false) => {
  const [state, setState] = useState(defaultValue);

  const actions = useMemo(() => {
    const setTrue = () => setState(true);
    const setFalse = () => setState(false);
    const toggle = () => setState((v) => !v);
    const set = (v: boolean) => setState(v);
    return {
      toggle,
      set,
      setTrue,
      setFalse,
    } as const;
  }, []);

  return [state, actions] as const;
};

export { useBoolean };
