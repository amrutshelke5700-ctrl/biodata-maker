import React from 'react';
import {
  AppLanguage,
  BiodataMode,
  JobBiodata,
  MarriageBiodata,
  TemplateId,
} from '../types/biodata';
import { getLanguageMeta } from '../utils/languageFonts';
import { getCopy } from '../utils/translations';
import { getReligionFieldValues } from '../utils/religionConfig';
import { formatBirthDateForDisplay } from '../utils/smartFieldOptions';
import { ReligionEmblem } from './ReligionIcons';
import {
  LotusCorner,
  OrnateCorner,
  PaithaniBorderPattern,
  PaithaniSideStrip,
  RoyalGoldCorner,
  SaffronHeritageBand,
} from './TemplateDecorations';

interface A4PreviewSheetProps {
  mode: BiodataMode;
  language: AppLanguage;
  templateId: TemplateId;
  marriageData: MarriageBiodata;
  jobData: JobBiodata;
  showWatermark: boolean;
}

interface ThemePalette {
  paperBg: string;
  headingColor: string;
  subHeadingColor: string;
  accentColor: string;
  labelColor: string;
  valueColor: string;
  dividerColor: string;
  sectionBg: string;
  photoBorder: string;
}

function getPalette(templateId: TemplateId): ThemePalette {
  switch (templateId) {
    case 'royal-gold':
      return {
        paperBg: '#FFFDF7',
        headingColor: '#7C2D12',
        subHeadingColor: '#9A3412',
        accentColor: '#B8860B',
        labelColor: '#57534E',
        valueColor: '#1C1917',
        dividerColor: '#E7D8B1',
        sectionBg: '#FDF6E2',
        photoBorder: '#C59B27',
      };
    case 'paithani':
      return {
        paperBg: '#FFFBF6',
        headingColor: '#8E1A50',
        subHeadingColor: '#0F5C53',
        accentColor: '#C8962E',
        labelColor: '#4B5563',
        valueColor: '#1F2937',
        dividerColor: '#EAD1DC',
        sectionBg: '#FBF0F5',
        photoBorder: '#8E1A50',
      };
    case 'emerald-ivory':
      return {
        paperBg: '#FAFDF9',
        headingColor: '#064E3B',
        subHeadingColor: '#047857',
        accentColor: '#C59B27',
        labelColor: '#475569',
        valueColor: '#111827',
        dividerColor: '#CBE4D6',
        sectionBg: '#ECFDF5',
        photoBorder: '#064E3B',
      };
    case 'kumkum-maroon':
      return {
        paperBg: '#FFFDF9',
        headingColor: '#7F1D1D',
        subHeadingColor: '#B45309',
        accentColor: '#D97706',
        labelColor: '#57534E',
        valueColor: '#1C1917',
        dividerColor: '#F3D5C8',
        sectionBg: '#FEF2F2',
        photoBorder: '#991B1B',
      };
    case 'lotus-rose':
      return {
        paperBg: '#FFF9FB',
        headingColor: '#9D174D',
        subHeadingColor: '#BE185D',
        accentColor: '#DB2777',
        labelColor: '#4B5563',
        valueColor: '#1F2937',
        dividerColor: '#FBCFE8',
        sectionBg: '#FDF2F8',
        photoBorder: '#BE185D',
      };
    case 'saffron-maratha':
      return {
        paperBg: '#FFFDF5',
        headingColor: '#9A3412',
        subHeadingColor: '#B45309',
        accentColor: '#D97706',
        labelColor: '#57534E',
        valueColor: '#1C1917',
        dividerColor: '#FDE68A',
        sectionBg: '#FFF7ED',
        photoBorder: '#C2410C',
      };
    case 'modern-blue':
      return {
        paperBg: '#FFFFFF',
        headingColor: '#1E3A8A',
        subHeadingColor: '#1D4ED8',
        accentColor: '#2563EB',
        labelColor: '#475569',
        valueColor: '#0F172A',
        dividerColor: '#DBEAFE',
        sectionBg: '#EFF6FF',
        photoBorder: '#2563EB',
      };
    case 'charcoal-exec':
      return {
        paperBg: '#FFFFFF',
        headingColor: '#0F172A',
        subHeadingColor: '#334155',
        accentColor: '#475569',
        labelColor: '#475569',
        valueColor: '#0F172A',
        dividerColor: '#CBD5E1',
        sectionBg: '#F1F5F9',
        photoBorder: '#334155',
      };
    case 'teal-modern':
      return {
        paperBg: '#FFFFFF',
        headingColor: '#0F766E',
        subHeadingColor: '#0D9488',
        accentColor: '#14B8A6',
        labelColor: '#475569',
        valueColor: '#0F172A',
        dividerColor: '#CCFBF1',
        sectionBg: '#F0FDFA',
        photoBorder: '#0D9488',
      };
    case 'minimalist':
    default:
      return {
        paperBg: '#FFFFFF',
        headingColor: '#111827',
        subHeadingColor: '#374151',
        accentColor: '#4B5563',
        labelColor: '#4B5563',
        valueColor: '#111827',
        dividerColor: '#E5E7EB',
        sectionBg: '#F3F4F6',
        photoBorder: '#374151',
      };
  }
}

const WatermarkLayer: React.FC<{ watermarkText: string; language: AppLanguage }> = ({
  watermarkText,
  language,
}) => {
  const rows = [0, 1, 2, 3, 4];
  const cols = [0, 1, 2];
  const langMeta = getLanguageMeta(language);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 30,
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: 'absolute',
          top: '-180px',
          left: '-180px',
          right: '-180px',
          bottom: '-180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          transform: 'rotate(-34deg)',
        }}
      >
        {rows.map((r) => (
          <div
            key={r}
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            {cols.map((c) => (
              <span
                key={`${r}-${c}`}
                style={{
                  fontSize: '42px',
                  fontWeight: 700,
                  letterSpacing: language === 'en' ? '0.28em' : 'normal',
                  color: 'rgba(71, 85, 105, 0.16)',
                  userSelect: 'none',
                  fontFamily: langMeta.fontStack,
                }}
              >
                {watermarkText}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const FrameChrome: React.FC<{ templateId: TemplateId }> = ({ templateId }) => {
  if (templateId === 'royal-gold') {
    return (
      <>
        <div
          style={{
            position: 'absolute',
            inset: '14px',
            border: '2.5px solid #B8860B',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '20px',
            border: '1px solid #D4AF37',
            pointerEvents: 'none',
          }}
        />
        <RoyalGoldCorner position="tl" />
        <RoyalGoldCorner position="tr" />
        <RoyalGoldCorner position="bl" />
        <RoyalGoldCorner position="br" />
      </>
    );
  }

  if (templateId === 'paithani') {
    return (
      <>
        <PaithaniBorderPattern side="top" />
        <PaithaniBorderPattern side="bottom" />
        <PaithaniSideStrip side="left" />
        <PaithaniSideStrip side="right" />
        <div
          style={{
            position: 'absolute',
            top: '44px',
            bottom: '44px',
            left: '30px',
            right: '30px',
            border: '1px solid #E2B857',
            pointerEvents: 'none',
          }}
        />
      </>
    );
  }

  if (templateId === 'emerald-ivory') {
    return (
      <>
        <div
          style={{
            position: 'absolute',
            inset: '14px',
            border: '2.5px solid #064E3B',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '20px',
            border: '1px solid #C59B27',
            pointerEvents: 'none',
          }}
        />
        <OrnateCorner position="tl" primaryColor="#064E3B" accentColor="#C59B27" />
        <OrnateCorner position="tr" primaryColor="#064E3B" accentColor="#C59B27" />
        <OrnateCorner position="bl" primaryColor="#064E3B" accentColor="#C59B27" />
        <OrnateCorner position="br" primaryColor="#064E3B" accentColor="#C59B27" />
      </>
    );
  }

  if (templateId === 'kumkum-maroon') {
    return (
      <>
        <div
          style={{
            position: 'absolute',
            inset: '14px',
            border: '3px solid #7F1D1D',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '21px',
            border: '1.25px solid #D97706',
            pointerEvents: 'none',
          }}
        />
        <OrnateCorner position="tl" primaryColor="#7F1D1D" accentColor="#D97706" />
        <OrnateCorner position="tr" primaryColor="#7F1D1D" accentColor="#D97706" />
        <OrnateCorner position="bl" primaryColor="#7F1D1D" accentColor="#D97706" />
        <OrnateCorner position="br" primaryColor="#7F1D1D" accentColor="#D97706" />
      </>
    );
  }

  if (templateId === 'lotus-rose') {
    return (
      <>
        <div
          style={{
            position: 'absolute',
            inset: '15px',
            border: '2px solid #BE185D',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '21px',
            border: '1px solid #F472B6',
            pointerEvents: 'none',
          }}
        />
        <LotusCorner position="tl" />
        <LotusCorner position="tr" />
        <LotusCorner position="bl" />
        <LotusCorner position="br" />
      </>
    );
  }

  if (templateId === 'saffron-maratha') {
    return (
      <>
        <SaffronHeritageBand side="top" />
        <SaffronHeritageBand side="bottom" />
        <div
          style={{
            position: 'absolute',
            top: '36px',
            bottom: '36px',
            left: '16px',
            right: '16px',
            borderLeft: '2px solid #C2410C',
            borderRight: '2px solid #C2410C',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '42px',
            bottom: '42px',
            left: '22px',
            right: '22px',
            border: '1px solid #F59E0B',
            pointerEvents: 'none',
          }}
        />
      </>
    );
  }

  if (templateId === 'modern-blue') {
    return (
      <>
        <div
          style={{
            position: 'absolute',
            inset: '14px',
            border: '1.5px solid #BFDBFE',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            right: '14px',
            height: '6px',
            backgroundColor: '#1E3A8A',
            pointerEvents: 'none',
          }}
        />
      </>
    );
  }

  if (templateId === 'charcoal-exec') {
    return (
      <>
        <div
          style={{
            position: 'absolute',
            inset: '14px',
            border: '1.5px solid #CBD5E1',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '14px',
            bottom: '14px',
            left: '14px',
            width: '7px',
            backgroundColor: '#0F172A',
            pointerEvents: 'none',
          }}
        />
      </>
    );
  }

  if (templateId === 'teal-modern') {
    return (
      <>
        <div
          style={{
            position: 'absolute',
            inset: '14px',
            border: '1.5px solid #99F6E4',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            right: '14px',
            height: '6px',
            backgroundColor: '#0F766E',
            pointerEvents: 'none',
          }}
        />
      </>
    );
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: '18px',
          border: '1.5px solid #374151',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '23px',
          border: '0.75px solid #D1D5DB',
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

const InfoRow: React.FC<{
  label: string;
  value: string;
  palette: ThemePalette;
  isRtl?: boolean;
}> = ({ label, value, palette, isRtl = false }) => {
  if (!value.trim()) return null;
  return (
    <tr style={{ verticalAlign: 'top' }}>
      <td
        style={{
          width: '175px',
          padding: isRtl ? '4.5px 0 4.5px 8px' : '4.5px 8px 4.5px 0',
          fontSize: '13.5px',
          fontWeight: 600,
          color: palette.labelColor,
          lineHeight: 1.5,
          whiteSpace: 'nowrap',
          textAlign: isRtl ? 'right' : 'left',
        }}
      >
        {label}
      </td>
      <td
        style={{
          width: '14px',
          padding: '4.5px 4px',
          fontSize: '13.5px',
          fontWeight: 600,
          color: palette.labelColor,
          lineHeight: 1.5,
        }}
      >
        :
      </td>
      <td
        style={{
          padding: '4.5px 0',
          fontSize: '13.8px',
          fontWeight: 500,
          color: palette.valueColor,
          lineHeight: 1.5,
          wordBreak: 'break-word',
          textAlign: isRtl ? 'right' : 'left',
        }}
      >
        {value}
      </td>
    </tr>
  );
};

const SectionHeading: React.FC<{
  title: string;
  language: AppLanguage;
  palette: ThemePalette;
  templateId: TemplateId;
}> = ({ title, language, palette, templateId }) => {
  const langMeta = getLanguageMeta(language);
  const isClassic =
    templateId === 'royal-gold' ||
    templateId === 'paithani' ||
    templateId === 'emerald-ivory' ||
    templateId === 'kumkum-maroon' ||
    templateId === 'lotus-rose' ||
    templateId === 'saffron-maratha';
  return (
    <div
      style={{
        marginTop: '14px',
        marginBottom: '8px',
        padding: '4px 10px',
        backgroundColor: palette.sectionBg,
        borderBottom: `1.5px solid ${palette.accentColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span
        style={{
          fontSize: '14.5px',
          fontWeight: 700,
          color: palette.headingColor,
          fontFamily: isClassic ? langMeta.serifFontStack : langMeta.fontStack,
          letterSpacing: language === 'en' ? '0.01em' : 'normal',
        }}
      >
        {title}
      </span>
    </div>
  );
};

export const A4PreviewSheet: React.FC<A4PreviewSheetProps> = ({
  mode,
  language,
  templateId,
  marriageData,
  jobData,
  showWatermark,
}) => {
  const copy = getCopy(language);
  const langMeta = getLanguageMeta(language);
  const palette = getPalette(templateId);
  const contentPadding =
    templateId === 'paithani'
      ? '56px 50px 54px 50px'
      : templateId === 'saffron-maratha'
      ? '54px 48px 52px 48px'
      : '42px 46px 40px 46px';

  return (
    <div
      className="a4-paper-root"
      dir={langMeta.dir}
      style={{
        backgroundColor: palette.paperBg,
        padding: contentPadding,
        fontFamily: langMeta.fontStack,
        direction: langMeta.dir,
      }}
    >
      <FrameChrome templateId={templateId} />
      {showWatermark && (
        <WatermarkLayer watermarkText={copy.watermarkWord} language={language} />
      )}

      {mode === 'marriage' ? (
        <MarriageContent
          data={marriageData}
          language={language}
          templateId={templateId}
          palette={palette}
        />
      ) : (
        <JobContent
          data={jobData}
          language={language}
          templateId={templateId}
          palette={palette}
        />
      )}
    </div>
  );
};

const MarriageContent: React.FC<{
  data: MarriageBiodata;
  language: AppLanguage;
  templateId: TemplateId;
  palette: ThemePalette;
}> = ({ data, language, templateId, palette }) => {
  const copy = getCopy(language);
  const langMeta = getLanguageMeta(language);
  const isRtl = langMeta.dir === 'rtl';
  const isOrnate =
    templateId === 'royal-gold' ||
    templateId === 'paithani' ||
    templateId === 'emerald-ivory' ||
    templateId === 'kumkum-maroon' ||
    templateId === 'lotus-rose' ||
    templateId === 'saffron-maratha';
  const formattedBirthDate = formatBirthDateForDisplay(
    data.birthDate,
    language,
    data.showAge ?? true
  );
  const religionRows = getReligionFieldValues(data, language);
  const hasPersonal =
    data.fullName ||
    data.birthDate ||
    data.birthTime ||
    data.birthPlace ||
    data.height ||
    data.bloodGroup ||
    religionRows.some((row) => row.value.trim());
  const hasEdu = data.education || data.occupation || data.annualIncome;
  const hasFamily =
    data.fatherNameOccupation ||
    data.motherName ||
    data.brothers ||
    data.sisters ||
    data.mamaNameVillage ||
    data.expectations;
  const hasContact = data.address || data.mobile;

  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
      {/* Auspicious Top Header with Dynamic Religion Emblem */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '14px',
          paddingBottom: '10px',
          borderBottom: `1.5px solid ${palette.dividerColor}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3px' }}>
          <ReligionEmblem
            religion={data.religion || 'hindu'}
            color={palette.headingColor}
            size={34}
          />
        </div>
        <div
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: palette.headingColor,
            lineHeight: 1.4,
            fontFamily: isOrnate ? langMeta.serifFontStack : langMeta.fontStack,
          }}
        >
          {data.headerTitle.trim() || copy.headerTitlePlaceholder}
        </div>
        <div
          style={{
            marginTop: '3px',
            fontSize: '12.5px',
            fontWeight: 600,
            color: palette.subHeadingColor,
            letterSpacing: language === 'en' ? '0.08em' : 'normal',
          }}
        >
          {copy.a4MarriageSubtitle}
        </div>
      </div>

      {/* Personal Information + Optional Photo */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <SectionHeading
            title={copy.personalSection}
            language={language}
            palette={palette}
            templateId={templateId}
          />
          {hasPersonal ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <InfoRow label={copy.fullNameLabel} value={data.fullName} palette={palette} isRtl={isRtl} />
                <InfoRow label={copy.birthDateLabel} value={formattedBirthDate} palette={palette} isRtl={isRtl} />
                <InfoRow label={copy.birthTimeLabel} value={data.birthTime} palette={palette} isRtl={isRtl} />
                <InfoRow label={copy.birthPlaceLabel} value={data.birthPlace} palette={palette} isRtl={isRtl} />
                <InfoRow label={copy.heightLabel} value={data.height} palette={palette} isRtl={isRtl} />
                <InfoRow label={copy.bloodGroupLabel} value={data.bloodGroup} palette={palette} isRtl={isRtl} />
                {religionRows.map((row) => (
                  <InfoRow
                    key={row.key}
                    label={row.label}
                    value={row.value}
                    palette={palette}
                    isRtl={isRtl}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontSize: '13px', color: '#9CA3AF', padding: '6px 0' }}>
              {copy.a4EmptyPersonalHint}
            </p>
          )}
        </div>

        {data.photoDataUrl && (
          <div
            style={{
              width: data.photoShape === 'circle' ? '186px' : '202px',
              flexShrink: 0,
              marginTop: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: data.photoShape === 'circle' ? '184px' : '200px',
                height: data.photoShape === 'circle' ? '184px' : '300px',
                borderRadius: data.photoShape === 'circle' ? '9999px' : '10px',
                border: `3.5px solid ${palette.photoBorder}`,
                padding: '3px',
                backgroundColor: '#FFFFFF',
                overflow: 'hidden',
              }}
            >
              <img
                src={data.photoDataUrl}
                alt={data.fullName || copy.photoAlt}
                loading="eager"
                decoding="sync"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: data.photoShape === 'circle' ? '9999px' : '6px',
                  display: 'block',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Education & Career */}
      {hasEdu && (
        <div>
          <SectionHeading
            title={copy.a4EduWorkTitle}
            language={language}
            palette={palette}
            templateId={templateId}
          />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <InfoRow label={copy.educationLabel} value={data.education} palette={palette} isRtl={isRtl} />
              <InfoRow label={copy.occupationLabel} value={data.occupation} palette={palette} isRtl={isRtl} />
              <InfoRow label={copy.incomeLabel} value={data.annualIncome} palette={palette} isRtl={isRtl} />
            </tbody>
          </table>
        </div>
      )}

      {/* Family Details */}
      {hasFamily && (
        <div>
          <SectionHeading
            title={copy.a4FamilyTitle}
            language={language}
            palette={palette}
            templateId={templateId}
          />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <InfoRow
                label={copy.fatherLabel}
                value={data.fatherNameOccupation}
                palette={palette}
                isRtl={isRtl}
              />
              <InfoRow label={copy.motherLabel} value={data.motherName} palette={palette} isRtl={isRtl} />
              <InfoRow label={copy.brothersLabel} value={data.brothers} palette={palette} isRtl={isRtl} />
              <InfoRow label={copy.sistersLabel} value={data.sisters} palette={palette} isRtl={isRtl} />
              <InfoRow label={copy.mamaLabel} value={data.mamaNameVillage} palette={palette} isRtl={isRtl} />
              <InfoRow label={copy.expectationsLabel} value={data.expectations} palette={palette} isRtl={isRtl} />
            </tbody>
          </table>
        </div>
      )}

      {/* Contact */}
      {hasContact && (
        <div>
          <SectionHeading
            title={copy.a4ContactTitle}
            language={language}
            palette={palette}
            templateId={templateId}
          />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <InfoRow label={copy.addressLabel} value={data.address} palette={palette} isRtl={isRtl} />
              <InfoRow label={copy.mobileLabel} value={data.mobile} palette={palette} isRtl={isRtl} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const JobContent: React.FC<{
  data: JobBiodata;
  language: AppLanguage;
  templateId: TemplateId;
  palette: ThemePalette;
}> = ({ data, language, templateId, palette }) => {
  const copy = getCopy(language);
  const isRtl = getLanguageMeta(language).dir === 'rtl';
  const hasDarkBanner =
    templateId === 'modern-blue' ||
    templateId === 'charcoal-exec' ||
    templateId === 'teal-modern';
  const bannerBg =
    templateId === 'charcoal-exec'
      ? '#0F172A'
      : templateId === 'teal-modern'
      ? '#0F766E'
      : templateId === 'modern-blue'
      ? '#1E3A8A'
      : palette.sectionBg;
  const bannerSubColor =
    templateId === 'charcoal-exec'
      ? '#CBD5E1'
      : templateId === 'teal-modern'
      ? '#CCFBF1'
      : '#DBEAFE';
  const validEducation = data.educationList.filter(
    (item) => item.degree.trim() || item.institute.trim() || item.year.trim() || item.score.trim()
  );
  const validExperience = data.experienceList.filter(
    (item) => item.role.trim() || item.company.trim() || item.duration.trim() || item.details.trim()
  );

  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
      {/* Resume Header */}
      <div
        style={{
          backgroundColor: bannerBg,
          color: hasDarkBanner ? '#FFFFFF' : palette.headingColor,
          padding: '18px 20px',
          borderRadius: '4px',
          borderBottom: hasDarkBanner ? 'none' : `2px solid ${palette.accentColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '18px',
          marginBottom: '16px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: '25px',
              fontWeight: 700,
              lineHeight: 1.25,
              color: hasDarkBanner ? '#FFFFFF' : palette.headingColor,
            }}
          >
            {data.fullName.trim() || copy.a4JobNameFallback}
          </h1>
          {data.designation.trim() && (
            <div
              style={{
                marginTop: '4px',
                fontSize: '14.5px',
                fontWeight: 500,
                color: hasDarkBanner ? bannerSubColor : palette.subHeadingColor,
              }}
            >
              {data.designation}
            </div>
          )}
          <div
            style={{
              marginTop: '10px',
              fontSize: '12.5px',
              lineHeight: 1.55,
              color: hasDarkBanner ? '#E2E8F0' : palette.labelColor,
            }}
          >
            {[data.mobile, data.email].filter((v) => v.trim()).join('  |  ')}
            {data.address.trim() && (
              <div style={{ marginTop: '2px' }}>{data.address}</div>
            )}
          </div>
        </div>

        {data.photoDataUrl && (
          <div
            style={{
              width: data.photoShape === 'circle' ? '124px' : '104px',
              height: data.photoShape === 'circle' ? '124px' : '156px',
              flexShrink: 0,
              borderRadius: data.photoShape === 'circle' ? '9999px' : '8px',
              border: `3px solid ${hasDarkBanner ? '#FFFFFF' : palette.photoBorder}`,
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
            }}
          >
            <img
              src={data.photoDataUrl}
              alt={data.fullName || copy.photoAlt}
              loading="eager"
              decoding="sync"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: data.photoShape === 'circle' ? '9999px' : '5px',
                display: 'block',
              }}
            />
          </div>
        )}
      </div>

      {/* Career Objective */}
      {data.careerObjective.trim() && (
        <div style={{ marginBottom: '14px' }}>
          <SectionHeading
            title={copy.a4JobObjectiveTitle}
            language={language}
            palette={palette}
            templateId={templateId}
          />
          <p
            style={{
              margin: '6px 0 0 0',
              fontSize: '13.5px',
              lineHeight: 1.65,
              color: palette.valueColor,
            }}
          >
            {data.careerObjective}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {validExperience.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <SectionHeading
            title={copy.a4JobExperienceTitle}
            language={language}
            palette={palette}
            templateId={templateId}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            {validExperience.map((exp) => (
              <div
                key={exp.id}
                style={{
                  paddingBottom: '10px',
                  borderBottom: `1px solid ${palette.dividerColor}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14.5px',
                      fontWeight: 700,
                      color: palette.valueColor,
                    }}
                  >
                    {exp.role}
                  </span>
                  {exp.duration && (
                    <span
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: palette.subHeadingColor,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {exp.duration}
                    </span>
                  )}
                </div>
                {exp.company && (
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: palette.labelColor,
                      marginTop: '2px',
                    }}
                  >
                    {exp.company}
                  </div>
                )}
                {exp.details && (
                  <p
                    style={{
                      margin: '5px 0 0 0',
                      fontSize: '13px',
                      lineHeight: 1.55,
                      color: palette.valueColor,
                    }}
                  >
                    {exp.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {validEducation.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <SectionHeading
            title={copy.a4JobEducationTitle}
            language={language}
            palette={palette}
            templateId={templateId}
          />
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '6px',
              fontSize: '13px',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `1.5px solid ${palette.dividerColor}`,
                  textAlign: isRtl ? 'right' : 'left',
                }}
              >
                <th
                  style={{
                    padding: isRtl ? '6px 0 6px 8px' : '6px 8px 6px 0',
                    color: palette.headingColor,
                    fontWeight: 700,
                  }}
                >
                  {copy.a4ColDegree}
                </th>
                <th style={{ padding: '6px 8px', color: palette.headingColor, fontWeight: 700 }}>
                  {copy.a4ColInstitute}
                </th>
                <th
                  style={{
                    padding: '6px 8px',
                    color: palette.headingColor,
                    fontWeight: 700,
                    textAlign: 'center',
                    width: '78px',
                  }}
                >
                  {copy.a4ColYear}
                </th>
                <th
                  style={{
                    padding: isRtl ? '6px 8px 6px 0' : '6px 0 6px 8px',
                    color: palette.headingColor,
                    fontWeight: 700,
                    textAlign: isRtl ? 'left' : 'right',
                    width: '86px',
                  }}
                >
                  {copy.a4ColScore}
                </th>
              </tr>
            </thead>
            <tbody>
              {validEducation.map((edu) => (
                <tr
                  key={edu.id}
                  style={{ borderBottom: `1px solid ${palette.dividerColor}` }}
                >
                  <td
                    style={{
                      padding: isRtl ? '7px 0 7px 8px' : '7px 8px 7px 0',
                      fontWeight: 600,
                      color: palette.valueColor,
                    }}
                  >
                    {edu.degree}
                  </td>
                  <td style={{ padding: '7px 8px', color: palette.labelColor }}>
                    {edu.institute}
                  </td>
                  <td
                    style={{
                      padding: '7px 8px',
                      textAlign: 'center',
                      color: palette.labelColor,
                    }}
                  >
                    {edu.year}
                  </td>
                  <td
                    style={{
                      padding: isRtl ? '7px 8px 7px 0' : '7px 0 7px 8px',
                      textAlign: isRtl ? 'left' : 'right',
                      fontWeight: 600,
                      color: palette.valueColor,
                    }}
                  >
                    {edu.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Skills */}
      {data.skills.trim() && (
        <div style={{ marginBottom: '12px' }}>
          <SectionHeading
            title={copy.a4JobSkillsTitle}
            language={language}
            palette={palette}
            templateId={templateId}
          />
          <p
            style={{
              margin: '6px 0 0 0',
              fontSize: '13.5px',
              lineHeight: 1.65,
              color: palette.valueColor,
            }}
          >
            {data.skills}
          </p>
        </div>
      )}

      {/* Languages */}
      {data.languages.trim() && (
        <div>
          <SectionHeading
            title={copy.a4JobLanguagesTitle}
            language={language}
            palette={palette}
            templateId={templateId}
          />
          <p
            style={{
              margin: '6px 0 0 0',
              fontSize: '13.5px',
              lineHeight: 1.6,
              color: palette.valueColor,
            }}
          >
            {data.languages}
          </p>
        </div>
      )}
    </div>
  );
};
