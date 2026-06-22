import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsCarousel extends Struct.ComponentSchema {
  collectionName: 'components_sections_carousels';
  info: {
    description: 'Horizontal scroll of cards (events, editorial)';
    displayName: 'Carousel section';
    icon: 'list';
  };
  attributes: {
    background: Schema.Attribute.Media<'images'>;
    backgroundOpacity: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 1;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0.3>;
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'sections.carousel-item', true>;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsCarouselItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_carousel_items';
  info: {
    description: 'Single card within a carousel section (event or editorial piece)';
    displayName: 'Carousel item';
    icon: 'calendar';
  };
  attributes: {
    date: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    location: Schema.Attribute.String;
    tags: Schema.Attribute.JSON;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsContent extends Struct.ComponentSchema {
  collectionName: 'components_sections_contents';
  info: {
    description: 'Image + copy block (join us, riyadh, dining, etc.)';
    displayName: 'Content section';
    icon: 'layout';
  };
  attributes: {
    background: Schema.Attribute.Media<'images'>;
    backgroundOpacity: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 1;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0.4>;
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    cta: Schema.Attribute.String;
    ctaLink: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images' | 'videos'>;
    subheading: Schema.Attribute.String;
    video: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SectionsFullBleed extends Struct.ComponentSchema {
  collectionName: 'components_sections_full_bleeds';
  info: {
    description: 'Single image with text overlay (about attach\u00E9)';
    displayName: 'Full-bleed section';
    icon: 'picture';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images' | 'videos'>;
    linkLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Explore'>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: 'Full-bleed top-of-homepage banner';
    displayName: 'Hero';
    icon: 'landscape';
  };
  attributes: {
    body: Schema.Attribute.Text;
    ctaPrimaryLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Book'>;
    ctaSecondaryLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Profile'>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'welcome to attach\u00E9'>;
    image: Schema.Attribute.Media<'images' | 'videos'>;
  };
}

export interface SharedContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_infos';
  info: {
    description: "Address/hours/phone/email shown in an amenity's Contact Us sheet";
    displayName: 'Contact info';
    icon: 'phone';
  };
  attributes: {
    address: Schema.Attribute.String;
    body: Schema.Attribute.Text;
    email: Schema.Attribute.String;
    hours: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface SharedIconGrid extends Struct.ComponentSchema {
  collectionName: 'components_shared_icon_grids';
  info: {
    description: 'Title + body + 2x3 icon-item grid sheet (Pool Club Rules, Gym Additional Services)';
    displayName: 'Icon grid';
    icon: 'grid';
  };
  attributes: {
    body: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'shared.icon-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedIconItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_icon_items';
  info: {
    description: 'Single icon + label row within an icon-grid sheet (rules, additional services)';
    displayName: 'Icon item';
    icon: 'grid';
  };
  attributes: {
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.carousel': SectionsCarousel;
      'sections.carousel-item': SectionsCarouselItem;
      'sections.content': SectionsContent;
      'sections.full-bleed': SectionsFullBleed;
      'sections.hero': SectionsHero;
      'shared.contact-info': SharedContactInfo;
      'shared.icon-grid': SharedIconGrid;
      'shared.icon-item': SharedIconItem;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
