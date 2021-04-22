import { useEffect, useState } from 'react';
import type { LintOption } from 'common/lint';

interface Setting {
  mode: 'standard' | 'professional';
  lintOption: LintOption;
}

const initialSetting: Setting = {
  mode: 'standard',
  lintOption: {},
};

const useSetting = () => {
  const [setting, dispatchSetting] = useState<Setting>(() => {
    const settingItem = localStorage.getItem('setting');

    return settingItem ? JSON.parse(settingItem) : initialSetting;
  });

  useEffect(() => localStorage.setItem('setting', JSON.stringify(setting)), [setting]);

  return { dispatchSetting, setting };
};

export { useSetting };
export type { Setting };
