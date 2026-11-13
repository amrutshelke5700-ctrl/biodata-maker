import React, { useRef, useState } from 'react';
import {
  Camera,
  Circle,
  Crop,
  Plus,
  RotateCcw,
  Square,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  AppLanguage,
  BiodataMode,
  JobBiodata,
  JobEducationItem,
  JobExperienceItem,
  MarriageBiodata,
  PhotoShape,
  ReligionType,
} from '../types/biodata';
import { getCopy } from '../utils/translations';
import {
  RELIGION_CONFIGS,
  getMarriageTitlePresets,
  getReligionConfig,
  resolveSectValue,
} from '../utils/religionConfig';
import {
  BIRTH_TIME_HOURS,
  BIRTH_TIME_MINUTES,
  BLOOD_GROUP_OPTIONS,
  HEIGHT_OPTIONS,
  MAHARASHTRA_BIRTHPLACES,
  RASHI_OPTIONS,
  calculateAgeFromIso,
  formatBirthTimeValue,
  getBirthTimePeriods,
  parseBirthTime,
  resolveHeightOptionId,
  resolveRashiOptionId,
  toLocalizedDigits,
} from '../utils/smartFieldOptions';
import { ImageCropModal } from './ImageCropModal';
import { ReligionEmblem } from './ReligionIcons';

interface BiodataFormProps {
  mode: BiodataMode;
  language: AppLanguage;
  marriageData: MarriageBiodata;
  jobData: JobBiodata;
  onChangeMarriage: (next: MarriageBiodata) => void;
  onChangeJob: (next: JobBiodata) => void;
  onLoadSample: () => void;
  onClearAll: () => void;
}

const inputBaseClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10';

const labelBaseClass = 'block text-xs font-semibold text-slate-700 mb-1.5';

export const BiodataForm: React.FC<BiodataFormProps> = ({
  mode,
  language,
  marriageData,
  jobData,
  onChangeMarriage,
  onChangeJob,
  onLoadSample,
  onClearAll,
}) => {
  const copy = getCopy(language);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [rawPhotoByMode, setRawPhotoByMode] = useState<Record<BiodataMode, string>>({
    marriage: '',
    job: '',
  });
  const [cropSourceUrl, setCropSourceUrl] = useState<string>('');
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);

  const currentPhoto = mode === 'marriage' ? marriageData.photoDataUrl : jobData.photoDataUrl;
  const currentShape = mode === 'marriage' ? marriageData.photoShape : jobData.photoShape;
  const titlePresets = getMarriageTitlePresets(language);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError(copy.photoTypeError);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(copy.photoSizeError);
      return;
    }
    setUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      setRawPhotoByMode((prev) => ({ ...prev, [mode]: result }));
      setCropSourceUrl(result);
      setIsCropModalOpen(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdjustCrop = () => {
    const source = rawPhotoByMode[mode] || currentPhoto;
    if (!source) return;
    setCropSourceUrl(source);
    setIsCropModalOpen(true);
  };

  const handleSaveCroppedPhoto = (croppedDataUrl: string) => {
    if (mode === 'marriage') {
      onChangeMarriage({ ...marriageData, photoDataUrl: croppedDataUrl });
    } else {
      onChangeJob({ ...jobData, photoDataUrl: croppedDataUrl });
    }
  };

  const handlePhotoShape = (shape: PhotoShape) => {
    if (mode === 'marriage') {
      onChangeMarriage({ ...marriageData, photoShape: shape });
    } else {
      onChangeJob({ ...jobData, photoShape: shape });
    }
  };

  const handleRemovePhoto = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setRawPhotoByMode((prev) => ({ ...prev, [mode]: '' }));
    if (mode === 'marriage') {
      onChangeMarriage({ ...marriageData, photoDataUrl: '' });
    } else {
      onChangeJob({ ...jobData, photoDataUrl: '' });
    }
  };

  const updateMarriageField = (key: keyof MarriageBiodata, value: string) => {
    onChangeMarriage({ ...marriageData, [key]: value });
  };

  const activeReligion = marriageData.religion || 'hindu';
  const religionConfig = getReligionConfig(activeReligion);
  const parsedBirthTime = parseBirthTime(marriageData.birthTime, language);
  const selectedHeightId = resolveHeightOptionId(marriageData.height);
  const selectedRashiId = resolveRashiOptionId(marriageData.rashi);
  const calculatedAge = calculateAgeFromIso(marriageData.birthDate);
  const todayIso = new Date().toISOString().split('T')[0];

  const handleReligionChange = (nextReligion: ReligionType) => {
    const nextCfg = getReligionConfig(nextReligion);
    onChangeMarriage({
      ...marriageData,
      religion: nextReligion,
      headerTitle: nextCfg.defaultTitle[language],
      sect: '',
    });
  };

  const handleBirthTimePartChange = (part: 'hour' | 'minute' | 'period', value: string) => {
    const nextHour = part === 'hour' ? value : parsedBirthTime.hour;
    const nextMinute = part === 'minute' ? value : parsedBirthTime.minute;
    const nextPeriod = part === 'period' ? value : parsedBirthTime.period;
    const formatted = formatBirthTimeValue(nextHour, nextMinute, nextPeriod, language);
    updateMarriageField('birthTime', formatted);
  };

  const updateJobField = (
    key:
      | 'fullName'
      | 'designation'
      | 'mobile'
      | 'email'
      | 'address'
      | 'careerObjective'
      | 'skills'
      | 'languages',
    value: string
  ) => {
    onChangeJob({ ...jobData, [key]: value });
  };

  const updateEduItem = (id: string, field: keyof JobEducationItem, value: string) => {
    onChangeJob({
      ...jobData,
      educationList: jobData.educationList.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const addEduItem = () => {
    const newItem: JobEducationItem = {
      id: `edu-${Date.now()}`,
      degree: '',
      institute: '',
      year: '',
      score: '',
    };
    onChangeJob({ ...jobData, educationList: [...jobData.educationList, newItem] });
  };

  const removeEduItem = (id: string) => {
    onChangeJob({
      ...jobData,
      educationList: jobData.educationList.filter((item) => item.id !== id),
    });
  };

  const updateExpItem = (id: string, field: keyof JobExperienceItem, value: string) => {
    onChangeJob({
      ...jobData,
      experienceList: jobData.experienceList.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const addExpItem = () => {
    const newItem: JobExperienceItem = {
      id: `exp-${Date.now()}`,
      role: '',
      company: '',
      duration: '',
      details: '',
    };
    onChangeJob({ ...jobData, experienceList: [...jobData.experienceList, newItem] });
  };

  const removeExpItem = (id: string) => {
    onChangeJob({
      ...jobData,
      experienceList: jobData.experienceList.filter((item) => item.id !== id),
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Top Form Utility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {mode === 'marriage' ? copy.formTitleMarriage : copy.formTitleJob}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{copy.formSubtitle}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {copy.loadSampleBtn}
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {copy.clearAllBtn}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-8">
        {/* Photo Upload & Frame Selector */}
        <section aria-label={copy.photoSectionTitle}>
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
            {copy.photoSectionTitle}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div
              className={`shrink-0 border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden ${
                currentShape === 'circle' ? 'w-28 h-28 rounded-full' : 'w-24 h-36 rounded-lg'
              }`}
            >
              {currentPhoto ? (
                <img
                  src={currentPhoto}
                  alt={copy.photoAlt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div className="flex-1 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="biodata-photo-input"
                />
                <label
                  htmlFor="biodata-photo-input"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {currentPhoto ? copy.photoChangeBtn : copy.photoUploadBtn}
                </label>

                {currentPhoto && (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenAdjustCrop}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      {copy.photoCropBtn}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-rose-700 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {copy.photoRemoveBtn}
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{copy.photoFrameLabel}</span>
                <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handlePhotoShape('circle')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      currentShape === 'circle'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Circle className="w-3 h-3" />
                    {copy.frameCircle}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePhotoShape('square')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      currentShape === 'square'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Square className="w-3 h-3" />
                    {copy.frameSquare}
                  </button>
                </div>
              </div>
              {uploadError && <p className="text-xs text-rose-600">{uploadError}</p>}
            </div>
          </div>
        </section>

        {mode === 'marriage' ? (
          <>
            {/* 1. Religion & Header Title */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
                {copy.religionSection}
              </h3>

              <div className="mb-4">
                <label htmlFor="m-religion" className={labelBaseClass}>
                  {copy.religionLabel}
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 shrink-0 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <ReligionEmblem religion={activeReligion} color="#7C2D12" size={26} />
                  </div>
                  <select
                    id="m-religion"
                    value={activeReligion}
                    onChange={(e) => handleReligionChange(e.target.value as ReligionType)}
                    className={inputBaseClass}
                  >
                    {RELIGION_CONFIGS.map((cfg) => (
                      <option key={cfg.id} value={cfg.id}>
                        {cfg.label[language]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label htmlFor="m-header-title" className={labelBaseClass}>
                {copy.headerTitleLabel}
              </label>
              <input
                id="m-header-title"
                type="text"
                value={marriageData.headerTitle}
                onChange={(e) => updateMarriageField('headerTitle', e.target.value)}
                placeholder={copy.headerTitlePlaceholder}
                className={inputBaseClass}
              />
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {titlePresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateMarriageField('headerTitle', preset)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                      marriageData.headerTitle === preset
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </section>

            {/* 2. Personal */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
                {copy.personalSection}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="m-fullname" className={labelBaseClass}>
                    {copy.fullNameLabel}
                  </label>
                  <input
                    id="m-fullname"
                    type="text"
                    value={marriageData.fullName}
                    onChange={(e) => updateMarriageField('fullName', e.target.value)}
                    placeholder={copy.fullNamePlaceholder}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label htmlFor="m-birthdate" className={labelBaseClass}>
                    {copy.birthDateLabel}
                  </label>
                  <input
                    id="m-birthdate"
                    type="date"
                    min="1950-01-01"
                    max={todayIso}
                    value={/^\d{4}-\d{2}-\d{2}$/.test(marriageData.birthDate) ? marriageData.birthDate : ''}
                    onChange={(e) => updateMarriageField('birthDate', e.target.value)}
                    className={inputBaseClass}
                  />
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={marriageData.showAge ?? true}
                        onChange={(e) =>
                          onChangeMarriage({ ...marriageData, showAge: e.target.checked })
                        }
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                      <span>{copy.showAgeLabel}</span>
                    </label>
                    {calculatedAge !== null && (
                      <span className="text-xs font-semibold text-emerald-700 tabular-nums">
                        {copy.ageBadgePrefix}{' '}
                        {toLocalizedDigits(calculatedAge, language)}{' '}
                        {copy.ageYearsUnit}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="m-birthtime-hour" className={labelBaseClass}>
                    {copy.birthTimeLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      id="m-birthtime-hour"
                      aria-label={copy.birthTimeHourPlaceholder}
                      value={parsedBirthTime.hour}
                      onChange={(e) => handleBirthTimePartChange('hour', e.target.value)}
                      className={`${inputBaseClass} px-2`}
                    >
                      <option value="">{copy.birthTimeHourPlaceholder}</option>
                      {BIRTH_TIME_HOURS.map((hr) => (
                        <option key={hr} value={hr}>
                          {toLocalizedDigits(hr, language)}
                        </option>
                      ))}
                    </select>
                    <select
                      id="m-birthtime-minute"
                      aria-label={copy.birthTimeMinutePlaceholder}
                      value={parsedBirthTime.minute}
                      onChange={(e) => handleBirthTimePartChange('minute', e.target.value)}
                      className={`${inputBaseClass} px-2`}
                    >
                      <option value="">{copy.birthTimeMinutePlaceholder}</option>
                      {BIRTH_TIME_MINUTES.map((min) => (
                        <option key={min} value={min}>
                          {toLocalizedDigits(min, language)}
                        </option>
                      ))}
                    </select>
                    <select
                      id="m-birthtime-period"
                      aria-label={copy.birthTimePeriodPlaceholder}
                      value={parsedBirthTime.period}
                      onChange={(e) => handleBirthTimePartChange('period', e.target.value)}
                      className={`${inputBaseClass} px-2`}
                    >
                      <option value="">{copy.birthTimePeriodPlaceholder}</option>
                      {getBirthTimePeriods(language).map((period) => (
                        <option key={period} value={period}>
                          {period}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="m-birthplace" className={labelBaseClass}>
                    {copy.birthPlaceLabel}
                  </label>
                  <input
                    id="m-birthplace"
                    type="text"
                    list="maharashtra-birthplaces"
                    value={marriageData.birthPlace}
                    onChange={(e) => updateMarriageField('birthPlace', e.target.value)}
                    placeholder={copy.birthPlacePlaceholder}
                    className={inputBaseClass}
                  />
                  <datalist id="maharashtra-birthplaces">
                    {MAHARASHTRA_BIRTHPLACES.map((city) => (
                      <option key={city.id} value={city.labels[language]} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label htmlFor="m-height" className={labelBaseClass}>
                    {copy.heightLabel}
                  </label>
                  <select
                    id="m-height"
                    value={selectedHeightId}
                    onChange={(e) => {
                      const opt = HEIGHT_OPTIONS.find((item) => item.id === e.target.value);
                      updateMarriageField('height', opt ? opt.labels[language] : '');
                    }}
                    className={inputBaseClass}
                  >
                    <option value="">{copy.heightPlaceholder}</option>
                    {HEIGHT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.labels[language]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="m-blood" className={labelBaseClass}>
                    {copy.bloodGroupLabel}
                  </label>
                  <select
                    id="m-blood"
                    value={marriageData.bloodGroup}
                    onChange={(e) => updateMarriageField('bloodGroup', e.target.value)}
                    className={inputBaseClass}
                  >
                    <option value="">{copy.bloodGroupPlaceholder}</option>
                    {BLOOD_GROUP_OPTIONS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic Religion-Specific Fields */}
                {religionConfig.id === 'secular' ? (
                  <div className="sm:col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
                    {copy.secularHiddenNote}
                  </div>
                ) : (
                  religionConfig.fields.map((field) => {
                    const fieldId = `m-rel-${field.key}`;
                    if (field.control === 'rashi-select') {
                      return (
                        <div key={field.key}>
                          <label htmlFor={fieldId} className={labelBaseClass}>
                            {field.label[language]}
                          </label>
                          <select
                            id={fieldId}
                            value={selectedRashiId}
                            onChange={(e) => {
                              const opt = RASHI_OPTIONS.find((item) => item.id === e.target.value);
                              updateMarriageField('rashi', opt ? opt.labels[language] : '');
                            }}
                            className={inputBaseClass}
                          >
                            <option value="">{field.placeholder[language]}</option>
                            {RASHI_OPTIONS.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.labels[language]}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }

                    if (field.control === 'sect-select' && religionConfig.sectOptions) {
                      const resolvedSect = resolveSectValue(
                        activeReligion,
                        marriageData.sect,
                        language
                      );
                      return (
                        <div key={field.key}>
                          <label htmlFor={fieldId} className={labelBaseClass}>
                            {field.label[language]}
                          </label>
                          <select
                            id={fieldId}
                            value={resolvedSect}
                            onChange={(e) => updateMarriageField('sect', e.target.value)}
                            className={inputBaseClass}
                          >
                            <option value="">{field.placeholder[language]}</option>
                            {religionConfig.sectOptions.map((opt) => (
                              <option key={opt.id} value={opt.labels[language]}>
                                {opt.labels[language]}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }

                    return (
                      <div key={field.key}>
                        <label htmlFor={fieldId} className={labelBaseClass}>
                          {field.label[language]}
                        </label>
                        <input
                          id={fieldId}
                          type="text"
                          value={marriageData[field.key]}
                          onChange={(e) => updateMarriageField(field.key, e.target.value)}
                          placeholder={field.placeholder[language]}
                          className={inputBaseClass}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* 3. Education & Career */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
                {copy.eduWorkSection}
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="m-education" className={labelBaseClass}>
                    {copy.educationLabel}
                  </label>
                  <input
                    id="m-education"
                    type="text"
                    value={marriageData.education}
                    onChange={(e) => updateMarriageField('education', e.target.value)}
                    placeholder={copy.educationPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label htmlFor="m-occupation" className={labelBaseClass}>
                    {copy.occupationLabel}
                  </label>
                  <input
                    id="m-occupation"
                    type="text"
                    value={marriageData.occupation}
                    onChange={(e) => updateMarriageField('occupation', e.target.value)}
                    placeholder={copy.occupationPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label htmlFor="m-income" className={labelBaseClass}>
                    {copy.incomeLabel}
                  </label>
                  <input
                    id="m-income"
                    type="text"
                    value={marriageData.annualIncome}
                    onChange={(e) => updateMarriageField('annualIncome', e.target.value)}
                    placeholder={copy.incomePlaceholder}
                    className={inputBaseClass}
                  />
                </div>
              </div>
            </section>

            {/* 4. Family */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
                {copy.familySection}
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="m-father" className={labelBaseClass}>
                    {copy.fatherLabel}
                  </label>
                  <input
                    id="m-father"
                    type="text"
                    value={marriageData.fatherNameOccupation}
                    onChange={(e) => updateMarriageField('fatherNameOccupation', e.target.value)}
                    placeholder={copy.fatherPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label htmlFor="m-mother" className={labelBaseClass}>
                    {copy.motherLabel}
                  </label>
                  <input
                    id="m-mother"
                    type="text"
                    value={marriageData.motherName}
                    onChange={(e) => updateMarriageField('motherName', e.target.value)}
                    placeholder={copy.motherPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="m-brothers" className={labelBaseClass}>
                      {copy.brothersLabel}
                    </label>
                    <input
                      id="m-brothers"
                      type="text"
                      value={marriageData.brothers}
                      onChange={(e) => updateMarriageField('brothers', e.target.value)}
                      placeholder={copy.brothersPlaceholder}
                      className={inputBaseClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="m-sisters" className={labelBaseClass}>
                      {copy.sistersLabel}
                    </label>
                    <input
                      id="m-sisters"
                      type="text"
                      value={marriageData.sisters}
                      onChange={(e) => updateMarriageField('sisters', e.target.value)}
                      placeholder={copy.sistersPlaceholder}
                      className={inputBaseClass}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="m-mama" className={labelBaseClass}>
                    {copy.mamaLabel}
                  </label>
                  <input
                    id="m-mama"
                    type="text"
                    value={marriageData.mamaNameVillage}
                    onChange={(e) => updateMarriageField('mamaNameVillage', e.target.value)}
                    placeholder={copy.mamaPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label htmlFor="m-expectations" className={labelBaseClass}>
                    {copy.expectationsLabel}
                  </label>
                  <textarea
                    id="m-expectations"
                    rows={2}
                    value={marriageData.expectations}
                    onChange={(e) => updateMarriageField('expectations', e.target.value)}
                    placeholder={copy.expectationsPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
              </div>
            </section>

            {/* 5. Contact */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
                {copy.contactSection}
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="m-address" className={labelBaseClass}>
                    {copy.addressLabel}
                  </label>
                  <textarea
                    id="m-address"
                    rows={2}
                    value={marriageData.address}
                    onChange={(e) => updateMarriageField('address', e.target.value)}
                    placeholder={copy.addressPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label htmlFor="m-mobile" className={labelBaseClass}>
                    {copy.mobileLabel}
                  </label>
                  <input
                    id="m-mobile"
                    type="text"
                    value={marriageData.mobile}
                    onChange={(e) => updateMarriageField('mobile', e.target.value)}
                    placeholder={copy.mobilePlaceholder}
                    className={inputBaseClass}
                  />
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Job Mode: 1. Personal & Contact */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
                {copy.jobPersonalSection}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="j-fullname" className={labelBaseClass}>
                    {copy.fullNameLabel}
                  </label>
                  <input
                    id="j-fullname"
                    type="text"
                    value={jobData.fullName}
                    onChange={(e) => updateJobField('fullName', e.target.value)}
                    placeholder={copy.jobFullNamePlaceholder}
                    className={inputBaseClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="j-designation" className={labelBaseClass}>
                    {copy.designationLabel}
                  </label>
                  <input
                    id="j-designation"
                    type="text"
                    value={jobData.designation}
                    onChange={(e) => updateJobField('designation', e.target.value)}
                    placeholder={copy.designationPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label htmlFor="j-mobile" className={labelBaseClass}>
                    {copy.mobileLabel}
                  </label>
                  <input
                    id="j-mobile"
                    type="text"
                    value={jobData.mobile}
                    onChange={(e) => updateJobField('mobile', e.target.value)}
                    placeholder={copy.jobMobilePlaceholder}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label htmlFor="j-email" className={labelBaseClass}>
                    {copy.emailLabel}
                  </label>
                  <input
                    id="j-email"
                    type="email"
                    value={jobData.email}
                    onChange={(e) => updateJobField('email', e.target.value)}
                    placeholder={copy.emailPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="j-address" className={labelBaseClass}>
                    {copy.addressLabel}
                  </label>
                  <input
                    id="j-address"
                    type="text"
                    value={jobData.address}
                    onChange={(e) => updateJobField('address', e.target.value)}
                    placeholder={copy.jobAddressPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
              </div>
            </section>

            {/* Job Mode: 2. Career Objective */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
                {copy.careerObjectiveSection}
              </h3>
              <textarea
                id="j-objective"
                rows={3}
                value={jobData.careerObjective}
                onChange={(e) => updateJobField('careerObjective', e.target.value)}
                placeholder={copy.careerObjectivePlaceholder}
                className={inputBaseClass}
              />
            </section>

            {/* Job Mode: 3. Education */}
            <section>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-900">{copy.educationSection}</h3>
                <button
                  type="button"
                  onClick={addEduItem}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {copy.addEducationBtn}
                </button>
              </div>
              <div className="space-y-4">
                {jobData.educationList.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        {copy.educationEntryPrefix}
                        {toLocalizedDigits(index + 1, language)}
                      </span>
                      {jobData.educationList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEduItem(edu.id)}
                          className="text-xs text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {copy.removeBtn}
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEduItem(edu.id, 'degree', e.target.value)}
                        placeholder={copy.degreePlaceholder}
                        className={inputBaseClass}
                      />
                      <input
                        type="text"
                        value={edu.institute}
                        onChange={(e) => updateEduItem(edu.id, 'institute', e.target.value)}
                        placeholder={copy.institutePlaceholder}
                        className={inputBaseClass}
                      />
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => updateEduItem(edu.id, 'year', e.target.value)}
                        placeholder={copy.yearPlaceholder}
                        className={inputBaseClass}
                      />
                      <input
                        type="text"
                        value={edu.score}
                        onChange={(e) => updateEduItem(edu.id, 'score', e.target.value)}
                        placeholder={copy.scorePlaceholder}
                        className={inputBaseClass}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Job Mode: 4. Experience */}
            <section>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-900">{copy.experienceSection}</h3>
                <button
                  type="button"
                  onClick={addExpItem}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {copy.addExperienceBtn}
                </button>
              </div>
              <div className="space-y-4">
                {jobData.experienceList.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        {copy.experienceEntryPrefix}
                        {toLocalizedDigits(index + 1, language)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExpItem(exp.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {copy.removeBtn}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExpItem(exp.id, 'role', e.target.value)}
                        placeholder={copy.rolePlaceholder}
                        className={inputBaseClass}
                      />
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateExpItem(exp.id, 'duration', e.target.value)}
                        placeholder={copy.durationPlaceholder}
                        className={inputBaseClass}
                      />
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExpItem(exp.id, 'company', e.target.value)}
                          placeholder={copy.companyPlaceholder}
                          className={inputBaseClass}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <textarea
                          rows={2}
                          value={exp.details}
                          onChange={(e) => updateExpItem(exp.id, 'details', e.target.value)}
                          placeholder={copy.detailsPlaceholder}
                          className={inputBaseClass}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {jobData.experienceList.length === 0 && (
                  <p className="text-xs text-slate-500">{copy.noExperienceHint}</p>
                )}
              </div>
            </section>

            {/* Job Mode: 5. Skills & Languages */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-4">
                {copy.skillsLangSection}
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="j-skills" className={labelBaseClass}>
                    {copy.skillsLabel}
                  </label>
                  <textarea
                    id="j-skills"
                    rows={2}
                    value={jobData.skills}
                    onChange={(e) => updateJobField('skills', e.target.value)}
                    placeholder={copy.skillsPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label htmlFor="j-languages" className={labelBaseClass}>
                    {copy.languagesLabel}
                  </label>
                  <input
                    id="j-languages"
                    type="text"
                    value={jobData.languages}
                    onChange={(e) => updateJobField('languages', e.target.value)}
                    placeholder={copy.languagesPlaceholder}
                    className={inputBaseClass}
                  />
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <ImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={cropSourceUrl}
        photoShape={currentShape}
        language={language}
        onChangeShape={handlePhotoShape}
        onClose={() => setIsCropModalOpen(false)}
        onSaveCropped={handleSaveCroppedPhoto}
      />
    </div>
  );
};
