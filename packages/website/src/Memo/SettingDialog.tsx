import React, { useCallback } from 'react';
import type { SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import type { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import type { DispatchSetting, Memo, Setting } from '../useMemo';

const useLintOptionChange = ({
  dispatchSetting,
  key,
}: {
  dispatchSetting: DispatchSetting;
  key: keyof Setting['lintOption'];
}) =>
  useCallback(
    (_event: SyntheticEvent, checked: boolean) =>
      dispatchSetting((prevSetting) => ({
        ...prevSetting,
        lintOption: {
          ...prevSetting.lintOption,
          [key]: checked,
        },
      })),
    [dispatchSetting, key]
  );

const useModeDispatch = ({
  dispatchSetting,
  mode,
}: {
  dispatchSetting: DispatchSetting;
  mode: Setting['mode'];
}) =>
  useCallback(
    () =>
      dispatchSetting((prevSetting) => ({
        ...prevSetting,
        mode,
      })),
    [dispatchSetting, mode]
  );

interface SettingDialogProps {
  dispatchSetting: DispatchSetting;
  open: DialogProps['open'];
  setting: Setting;
  memos: Memo[];
  onClose?: () => void;
}

const SettingDialog: React.FunctionComponent<SettingDialogProps> = React.memo(
  ({ dispatchSetting, open, setting, memos, onClose }) => {
    const handleProfessionalModeChange = useModeDispatch({ dispatchSetting, mode: 'professional' });
    const handleStandardModeChange = useModeDispatch({ dispatchSetting, mode: 'standard' });

    const handleGeneralNovelStyleJaChange = useLintOptionChange({
      dispatchSetting,
      key: 'generalNovelStyleJa',
    });

    const handleJaKyoikuKanjiChange = useLintOptionChange({
      dispatchSetting,
      key: 'jaKyoikuKanji',
    });

    const handleJaNoMixedPeriodChange = useLintOptionChange({
      dispatchSetting,
      key: 'jaNoMixedPeriod',
    });

    const handleJaNoWeakPhraseChange = useLintOptionChange({
      dispatchSetting,
      key: 'jaNoWeakPhrase',
    });

    const handleMaxAppearenceCountOfWordsChange = useLintOptionChange({
      dispatchSetting,
      key: 'maxAppearenceCountOfWords',
    });

    const handleNoFillerChange = useLintOptionChange({
      dispatchSetting,
      key: 'noFiller',
    });

    const handlePresetJaSpacingChange = useLintOptionChange({
      dispatchSetting,
      key: 'presetJaSpacing',
    });

    const handlePresetJaTechnicalWritingChange = useLintOptionChange({
      dispatchSetting,
      key: 'presetJaTechnicalWriting',
    });

    const handlePresetJTFStyleChange = useLintOptionChange({
      dispatchSetting,
      key: 'presetJTFStyle',
    });

    const handleUserDictionaryMemoIdChange = useCallback(
      (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        const userDictionaryMemoId = value === 'none' ? undefined : value;

        dispatchSetting((prevSetting) => ({
          ...prevSetting,
          lintOption: {
            ...prevSetting.lintOption,
            userDictionaryMemoId,
          },
        }));
      },
      [dispatchSetting]
    );

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>校正設定</DialogTitle>

        <DialogContent>
          <Box mb={4}>
            <FormControlLabel
              checked={setting.mode === 'standard'}
              control={<Radio color="primary" />}
              label="スタンダードモード"
              onChange={handleStandardModeChange}
            />

            <Typography variant="body1" gutterBottom>
              校正さんの標準設定です。 自分で設定を決めていく必要はありません。
            </Typography>
          </Box>

          <FormControlLabel
            checked={setting.mode === 'professional'}
            control={<Radio color="primary" />}
            label="プロフェッショナルモード"
            onChange={handleProfessionalModeChange}
          />

          <Typography variant="body1" gutterBottom>
            メモごとに校正したい項目を追加して、カスタマイズできます。
          </Typography>

          <Box mb={2}>
            <FormControl disabled={setting.mode !== 'professional'} fullWidth>
              <FormControlLabel
                checked={Boolean(setting.lintOption.generalNovelStyleJa)}
                control={<Checkbox />}
                label="小説の一般的な作法"
                onChange={handleGeneralNovelStyleJaChange}
              />

              <FormControlLabel
                checked={Boolean(setting.lintOption.presetJaTechnicalWriting)}
                control={<Checkbox />}
                label="技術文書"
                onChange={handlePresetJaTechnicalWritingChange}
              />

              <FormControlLabel
                checked={Boolean(setting.lintOption.presetJTFStyle)}
                control={<Checkbox />}
                label="JTF日本語標準スタイルガイド(翻訳用）"
                onChange={handlePresetJTFStyleChange}
              />

              <FormControlLabel
                checked={Boolean(setting.lintOption.jaNoWeakPhrase)}
                control={<Checkbox />}
                label="弱い表現の禁止"
                onChange={handleJaNoWeakPhraseChange}
              />

              <FormControlLabel
                checked={Boolean(setting.lintOption.maxAppearenceCountOfWords)}
                control={<Checkbox />}
                label="単語の出現回数の上限"
                onChange={handleMaxAppearenceCountOfWordsChange}
              />

              <FormControlLabel
                checked={Boolean(setting.lintOption.jaNoMixedPeriod)}
                control={<Checkbox />}
                label="句点の統一"
                onChange={handleJaNoMixedPeriodChange}
              />

              <FormControlLabel
                checked={Boolean(setting.lintOption.noFiller)}
                control={<Checkbox />}
                label="フィラーの禁止"
                onChange={handleNoFillerChange}
              />

              <FormControlLabel
                checked={Boolean(setting.lintOption.presetJaSpacing)}
                control={<Checkbox />}
                label="スペースの統一"
                onChange={handlePresetJaSpacingChange}
              />

              <FormControlLabel
                checked={Boolean(setting.lintOption.jaKyoikuKanji)}
                control={<Checkbox />}
                label="教育漢字のみ許可"
                onChange={handleJaKyoikuKanjiChange}
              />
            </FormControl>
          </Box>

          <FormControl
            variant="outlined"
            disabled={setting.mode !== 'professional'}
            fullWidth
            size="small"
          >
            <InputLabel>ユーザー辞書</InputLabel>
            <Select
              label="ユーザー辞書"
              value={setting.lintOption.userDictionaryMemoId ?? 'none'}
              onChange={handleUserDictionaryMemoIdChange}
            >
              <MenuItem value="none">(無し)</MenuItem>
              {memos.map((memo) => (
                <MenuItem key={memo.id} value={memo.id}>
                  {memo.text.trim().split('\n')[0]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
      </Dialog>
    );
  }
);

export { SettingDialog };
