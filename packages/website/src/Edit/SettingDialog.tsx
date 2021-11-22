import React, { useCallback } from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import type { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import type { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import type { DispatchSetting, Setting } from '../useMemo';

const useLintOptionChange = ({
  dispatchSetting,
  key,
}: {
  dispatchSetting: DispatchSetting;
  key: keyof Setting['lintOption'];
}) =>
  useCallback<NonNullable<FormControlLabelProps['onChange']>>(
    (_event, checked) =>
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
  onClose?: () => void;
}

const SettingDialog: React.FunctionComponent<SettingDialogProps> = React.memo(
  ({ dispatchSetting, open, setting, onClose }) => {
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
              校正さんの統一された校正設定。 設定を決める必要はありません。
            </Typography>
          </Box>

          <FormControlLabel
            checked={setting.mode === 'professional'}
            control={<Radio color="primary" />}
            label="プロフェッショナルモード"
            onChange={handleProfessionalModeChange}
          />

          <Typography variant="body1" gutterBottom>
            メモごとに校正設定を追加してカスタマイズできます。
          </Typography>

          <FormControl disabled={setting.mode !== 'professional'}>
            <FormControlLabel
              checked={setting.lintOption.generalNovelStyleJa ?? false}
              control={<Checkbox />}
              label="小説の一般的な作法"
              onChange={handleGeneralNovelStyleJaChange}
            />

            <FormControlLabel
              checked={setting.lintOption.presetJaTechnicalWriting ?? false}
              control={<Checkbox />}
              label="技術文書"
              onChange={handlePresetJaTechnicalWritingChange}
            />

            <FormControlLabel
              checked={setting.lintOption.presetJTFStyle ?? false}
              control={<Checkbox />}
              label="JTF日本語標準スタイルガイド(翻訳用）"
              onChange={handlePresetJTFStyleChange}
            />

            <FormControlLabel
              checked={setting.lintOption.jaNoWeakPhrase ?? false}
              control={<Checkbox />}
              label="弱い表現の禁止"
              onChange={handleJaNoWeakPhraseChange}
            />

            <FormControlLabel
              checked={setting.lintOption.maxAppearenceCountOfWords ?? false}
              control={<Checkbox />}
              label="単語の出現回数の上限"
              onChange={handleMaxAppearenceCountOfWordsChange}
            />

            <FormControlLabel
              checked={setting.lintOption.jaNoMixedPeriod ?? false}
              control={<Checkbox />}
              label="句点の統一"
              onChange={handleJaNoMixedPeriodChange}
            />

            <FormControlLabel
              checked={setting.lintOption.noFiller ?? false}
              control={<Checkbox />}
              label="フィラーの禁止"
              onChange={handleNoFillerChange}
            />

            <FormControlLabel
              checked={setting.lintOption.presetJaSpacing ?? false}
              control={<Checkbox />}
              label="スペースの統一"
              onChange={handlePresetJaSpacingChange}
            />

            <FormControlLabel
              checked={setting.lintOption.jaKyoikuKanji ?? false}
              control={<Checkbox />}
              label="教育漢字のみ許可"
              onChange={handleJaKyoikuKanjiChange}
            />
          </FormControl>
        </DialogContent>
      </Dialog>
    );
  }
);

export { SettingDialog };
