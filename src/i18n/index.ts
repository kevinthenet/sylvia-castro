import { en } from './en';
import { es } from './es';

export type Localization = {
  homepage: {
    title: string;
    heroSection: {
      header: string;
      subtitle: string;
      ctaButtons: {
        about: string;
        contact: string;
      };
    };
    serviceSection: {
      header: string;
      serviceCategories: {
        id: string;
        name: string;
        services: string[];
      }[];
    };
    aboutSection: {
      header: string;
      description: string;
      button: string;
    };
    recommendationSection: {
      header: string;
      recommendations: {
        name: string;
        image?: string;
        message: string;
      }[];
    };
    ctaSection: {
      header: string;
      subtitle: string;
      button: string;
    };
  };
  about: {
    title: string;
    header: string;
    subtitle: string;
    missionSection: {
      pictureAlt: string;
      header: string;
      text: string;
      stats: {
        name: string;
        value: string;
      }[];
    };
    valuesSection: {
      header: string;
      values: {
        ref: string;
        name: string;
        description: string;
      }[][];
    };
  };
  contact: {
    title: string;
    header: string;
    subtitle: string;
    info: {
      postalAddress: string;
      phoneNumber: string;
      email: string;
    };
    form: {
      fullName: string;
      email: string;
      message: string;
      submit: string;
    };
  };
  privacy: {
    title: string;
    header: string;
    subtitle: string;
    preamble: string;
    informationCollected: {
      header: string;
      preamble: string;
      list1: string;
      list2: string;
      list3: string;
    };
    informationUsage: {
      header: string;
      preamble: string;
      list1: string;
      list2: string;
      list3: string;
    };
    contactInformation: {
      header: string;
      text: string;
    };
  };
  404: {
    title: string;
    header: string;
    subtitle: string;
    action: string;
  };
  header: {
    logoAlt: string;
    description: string;
    toggleLanguage: string;
    toggleTheme: string;
    toggleMenu: string;
    links: {
      name: string;
      href: string;
    }[];
  };
  footer: {
    name: string;
    logoAlt: string;
    description: string;
    copyright: string;
    linkGroups: {
      header: string;
      links: {
        name: string;
        href: string;
        isExternal: boolean;
      }[];
    }[];
  };
};

type Language = 'en' | 'es';

type Messages = Record<Language, Localization>;

export const messages: Messages = {
  en,
  es,
};

type Paths<T> = T extends object
  ? { [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}` }[keyof T]
  : never;

type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never
        ? ''
        : `.${Leaves<T[K]>}`}`;
    }[keyof T]
  : never;

export type LocalizationPath = Paths<Localization>;
type LocalizationLeaf = Leaves<Localization>;

export const localize = (prefix: LocalizationPath, component: string) =>
  `$t('${prefix}.${component}')`;
