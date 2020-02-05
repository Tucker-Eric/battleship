import { useContext } from 'react';
import { TAppStore } from './AppStore';
import { MobXProviderContext } from 'mobx-react';

interface IUseStore {
  app: TAppStore;
}

const useStore = (): IUseStore => useContext(MobXProviderContext);

export default useStore;
