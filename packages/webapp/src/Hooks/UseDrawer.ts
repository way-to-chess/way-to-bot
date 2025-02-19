import { useParamSelector } from "./UseParamSelector";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { useActionCreator } from "./UseActionCreator";

const useDrawer = (drawerType: EDrawerType) => {
  const open = useParamSelector(drawerSlice.selectors.drawerOpen, drawerType);

  const onClose = useActionCreator(drawerSlice.actions.closeDrawer, {
    drawerType,
  });

  const trigger = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType,
  });

  const data = useParamSelector(drawerSlice.selectors.drawerData, drawerType);

  return { open, onClose, trigger, data };
};

export { useDrawer };
