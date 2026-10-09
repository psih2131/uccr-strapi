import type { Schema, Struct } from '@strapi/strapi';

export interface DirectiondAdvantagesItem extends Struct.ComponentSchema {
  collectionName: 'components_directiond_advantages_items';
  info: {
    displayName: 'advantages_item';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface DirectiondHero extends Struct.ComponentSchema {
  collectionName: 'components_directiond_heroes';
  info: {
    displayName: 'hero';
  };
  attributes: {
    advantages: Schema.Attribute.Component<'directiond.advantages-item', true>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    img_1: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    img_2: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    section_title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsAboutHeroSec extends Struct.ComponentSchema {
  collectionName: 'components_sections_about_hero_secs';
  info: {
    displayName: 'about_hero_sec';
  };
  attributes: {
    about_items: Schema.Attribute.Component<'shared.about-item-v2', true>;
    image: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String;
  };
}

export interface SectionsForWhoSec extends Struct.ComponentSchema {
  collectionName: 'components_sections_for_who_secs';
  info: {
    displayName: 'for_who_sec';
  };
  attributes: {
    for_who_items: Schema.Attribute.Component<'shared.for-who-item', true>;
    section_title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0414\u043B\u044F \u043A\u043E\u0433\u043E \u044D\u0442\u0430 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430?'>;
  };
}

export interface SectionsHomeHeroSec extends Struct.ComponentSchema {
  collectionName: 'components_sections_home_hero_secs';
  info: {
    displayName: 'home_hero_sec';
  };
  attributes: {
    box_1_image: Schema.Attribute.Media<'images'>;
    box_2_title: Schema.Attribute.String;
    box_3_title: Schema.Attribute.String;
    box_4_email: Schema.Attribute.Email;
    box_4_image: Schema.Attribute.Media<'images'>;
    box_4_phone: Schema.Attribute.String;
    box_4_socials: Schema.Attribute.Component<'shared.social-media', true>;
    box_4_title: Schema.Attribute.String;
    box1_title: Schema.Attribute.String;
    section_title: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
  };
}

export interface SectionsPriceSecV1 extends Struct.ComponentSchema {
  collectionName: 'components_sections_price_sec_v1s';
  info: {
    displayName: 'price_sec_v1';
  };
  attributes: {
    docs: Schema.Attribute.Media<'images', true>;
    price_item: Schema.Attribute.Component<'shared.price-item', true>;
  };
}

export interface SectionsPriceSecV2 extends Struct.ComponentSchema {
  collectionName: 'components_sections_price_sec_v2s';
  info: {
    displayName: 'price_sec_v2';
  };
  attributes: {
    price_list: Schema.Attribute.Component<'shared.price-item-2', true>;
    title_section: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u044F \u0438 \u0442\u0430\u0440\u0438\u0444\u044B'>;
  };
}

export interface SectionsReviews extends Struct.ComponentSchema {
  collectionName: 'components_sections_reviews';
  info: {
    displayName: 'reviews';
  };
  attributes: {
    reviews: Schema.Attribute.Relation<'oneToMany', 'api::review.review'>;
    section_title: Schema.Attribute.String;
  };
}

export interface SharedAboutItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_about_items';
  info: {
    displayName: 'about_item';
  };
  attributes: {
    add_plus_icon: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedAboutItemV2 extends Struct.ComponentSchema {
  collectionName: 'components_shared_about_item_v2s';
  info: {
    displayName: 'about_item_v2';
  };
  attributes: {
    text: Schema.Attribute.Text;
    value: Schema.Attribute.String;
  };
}

export interface SharedDocsItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_docs_items';
  info: {
    displayName: 'docs_item';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    displayName: 'faq_item';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    questions: Schema.Attribute.String;
  };
}

export interface SharedForWhoItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_for_who_items';
  info: {
    displayName: 'for_who_item';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedPartnerItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_partner_items';
  info: {
    displayName: 'partner_item';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface SharedPriceItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_price_items';
  info: {
    displayName: 'price_item';
  };
  attributes: {
    current_price: Schema.Attribute.Integer;
    hour: Schema.Attribute.Integer;
    old_price: Schema.Attribute.Integer;
  };
}

export interface SharedPriceItem2 extends Struct.ComponentSchema {
  collectionName: 'components_shared_price_item_2s';
  info: {
    displayName: 'price_item_2';
  };
  attributes: {
    current_price: Schema.Attribute.Integer;
    hour: Schema.Attribute.Integer;
    old_price: Schema.Attribute.Integer;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    type: Schema.Attribute.String;
  };
}

export interface SharedPrincipItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_princip_items';
  info: {
    displayName: 'princip_item';
  };
  attributes: {
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedSicialsItemV2 extends Struct.ComponentSchema {
  collectionName: 'components_shared_sicials_item_v2s';
  info: {
    displayName: 'sicials_item_v2';
  };
  attributes: {
    img: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    link: Schema.Attribute.String;
  };
}

export interface SharedSocialMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_medias';
  info: {
    displayName: 'social_media';
  };
  attributes: {
    name: Schema.Attribute.String;
    svg_icon_code: Schema.Attribute.Text;
    url: Schema.Attribute.String;
  };
}

export interface SharedStapsItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_staps_items';
  info: {
    displayName: 'staps_item';
  };
  attributes: {
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedWhatWaitingForItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_what_waiting_for_items';
  info: {
    displayName: 'what_waiting_for_item';
  };
  attributes: {
    text: Schema.Attribute.Text;
    time: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'20-30 \u0447\u0430\u0441\u043E\u0432'>;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'directiond.advantages-item': DirectiondAdvantagesItem;
      'directiond.hero': DirectiondHero;
      'sections.about-hero-sec': SectionsAboutHeroSec;
      'sections.for-who-sec': SectionsForWhoSec;
      'sections.home-hero-sec': SectionsHomeHeroSec;
      'sections.price-sec-v1': SectionsPriceSecV1;
      'sections.price-sec-v2': SectionsPriceSecV2;
      'sections.reviews': SectionsReviews;
      'shared.about-item': SharedAboutItem;
      'shared.about-item-v2': SharedAboutItemV2;
      'shared.docs-item': SharedDocsItem;
      'shared.faq-item': SharedFaqItem;
      'shared.for-who-item': SharedForWhoItem;
      'shared.partner-item': SharedPartnerItem;
      'shared.price-item': SharedPriceItem;
      'shared.price-item-2': SharedPriceItem2;
      'shared.princip-item': SharedPrincipItem;
      'shared.sicials-item-v2': SharedSicialsItemV2;
      'shared.social-media': SharedSocialMedia;
      'shared.staps-item': SharedStapsItem;
      'shared.what-waiting-for-item': SharedWhatWaitingForItem;
    }
  }
}
