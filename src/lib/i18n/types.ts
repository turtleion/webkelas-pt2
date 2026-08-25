export type Locale = "id" | "en";

export interface TranslationSchema {
  nav: {
    home: string;
    members: string;
    organization: string;
    schedule: string;
    announcements: string;
    agenda: string;
    gallery: string;
    dashboard: string;
    adminPanel: string;
    settings: string;
    signIn: string;
    signOut: string;
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    mainWebsite: string;
    memberSpace: string;
  };
  settings: {
    title: string;
    subtitle: string;
    personalization: string;
    language: string;
    themeSection: string;
    themeSelect: string;
    colorSchemeSection: string;
    customColors: string;
    fontSection: string;
    fontSelect: string;
    backgroundSection: string;
    backgroundSelect: string;
    homeLayoutSection: string;
    modeSection: string;
    lightMode: string;
    darkMode: string;
    cartoonModeWarning: string;
    languageSection: string;
    selectLanguage: string;
    saveSuccess: string;
    resetDefaults: string;
    resetConfirm: string;
    customThemeNote: string;
    previewLabel: string;
  };
  themes: {
    paper: string;
    paperDesc: string;
    glass: string;
    glassDesc: string;
    cartoon: string;
    cartoonDesc: string;
    custom: string;
    customDesc: string;
  };
  layouts: {
    classic: string;
    classicDesc: string;
    bento: string;
    bentoDesc: string;
    showcase: string;
    showcaseDesc: string;
    modern: string;
    modernDesc: string;
    experimental: string;
    experimentalDesc: string;
    nature: string;
    natureDesc: string;
  };
  colors: {
    background: string;
    foreground: string;
    primary: string;
    onPrimary: string;
    accent: string;
    onAccent: string;
    card: string;
    onSurface: string;
    nav: string;
    onNav: string;
    tertiary: string;
    onTertiary: string;
    border: string;
    lightMode: string;
    darkMode: string;
    mainGroup: string;
    brandGroup: string;
    surfaceGroup: string;
    navGroup: string;
    advancedGroup: string;
  };
  home: {
    heroTag: string;
    heroSubtitle: string;
    heroDescription: string;
    readAnnouncements: string;
    viewMembers: string;
    classIdentity: string;
    classIdentityDesc: string;
    latestAnnouncements: string;
    allAnnouncements: string;
    upcomingAgenda: string;
    fullAgenda: string;
    nearest: string;
    classMembers: string;
    allMembers: string;
    galleryShowcase: string;
    openGallery: string;
    contactRow: string;
    contactRowDesc: string;
    viewOrgChart: string;
    classLabel: string;
    majorLabel: string;
    schoolLabel: string;
    homeroomLabel: string;
    chairmanLabel: string;
    studentCountLabel: string;
  };
  members: {
    pageTitle: string;
    heading: string;
    description: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchCount: string;
    note: string;
    emptySearch: string;
    emptyList: string;
    absenPrefix: string;
  };
  organization: {
    pageTitle: string;
    heading: string;
    description: string;
    metaCount: string;
    note: string;
    empty: string;
    homeroom: string;
    coreOfficers: string;
    coreSubtitle: string;
    divisions: string;
    divisionsSubtitle: string;
    responsibility: string;
  };
  schedule: {
    pageTitle: string;
    heading: string;
    description: string;
    semesterMeta: string;
    note: string;
    empty: string;
    breakLabel: string;
    timeColumn: string;
    subjectColumn: string;
    roomColumn: string;
  };
  announcements: {
    pageTitle: string;
    heading: string;
    description: string;
    entriesMeta: string;
    note: string;
    empty: string;
  };
  agenda: {
    pageTitle: string;
    heading: string;
    description: string;
    chronologicalMeta: string;
    note: string;
    empty: string;
    nearestTag: string;
  };
  gallery: {
    pageTitle: string;
    heading: string;
    description: string;
    documentsMeta: string;
    note: string;
    empty: string;
    docPrefix: string;
  };
  auth: {
    pageTitle: string;
    badge: string;
    heading: string;
    description: string;
    googleBtn: string;
    guestBtn: string;
    orSeparator: string;
    errorGoogle: string;
    errorGuest: string;
    backHome: string;
  };
  register: {
    pageTitle: string;
    badge: string;
    heading: string;
    description: string;
    googleBtn: string;
    codeLabel: string;
    codePlaceholder: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    errorGeneric: string;
    errorNetwork: string;
    alreadyVerifiedRedirect: string;
    signOutLink: string;
    backHome: string;
    googlePromptTitle: string;
    googlePromptDesc: string;
    guestBlockTitle: string;
    guestBlockDesc: string;
    guestBlockCta: string;
  };
  verificationBar: {
    title: string;
    description: string;
    cta: string;
  };
  dashboard: {
    pageTitle: string;
    badge: string;
    welcome: string;
    guestName: string;
    memberName: string;
    roleGuest: string;
    roleOwner: string;
    roleAdmin: string;
    roleMember: string;
    adminAccessTitle: string;
    adminAccessDesc: string;
    openAdminBtn: string;
    workspaceTitle: string;
    guestWorkspaceDesc: string;
    memberWorkspaceDesc: string;
    backHome: string;
    signOutBtn: string;
  };
  notFound: {
    pageTitle: string;
    heading: string;
    description: string;
    backHome: string;
  };
  admin: {
    sidebarHeader: string;
    overview: string;
    manageModules: string;
    themeManagement: string;
    usersManagement: string;
    announcements: string;
    agenda: string;
    schedule: string;
    members: string;
    gallery: string;
    organization: string;
    globalDefaultsTitle: string;
    globalDefaultsDesc: string;
    fontsManagement: string;
    addFont: string;
    removeFont: string;
    fontName: string;
    fontUrl: string;
    defaultTheme: string;
    defaultMode: string;
    defaultColorScheme: string;
    defaultFont: string;
    defaultBackground: string;
    defaultLayout: string;
    defaultLanguage: string;
    saveDefaults: string;
    sessionLabel: string;
    signOutPanel: string;
    mainWebsiteLink: string;
    dashboardTitle: string;
    dashboardDesc: string;
    publishedCount: string;
    recordedEvents: string;
    teachingHours: string;
    registeredStudents: string;
    savedPhotos: string;
    addStudent: string;
    editStudent: string;
    studentName: string;
    absenNo: string;
    positionLabel: string;
    actions: string;
    deleteConfirmTitle: string;
    deleteConfirmDesc: string;

    // Toast messages — agenda
    toastAgendaRequired: string;
    toastAgendaUpdated: string;
    toastAgendaCreated: string;
    toastAgendaSaveError: string;
    toastAgendaDeleted: string;
    toastAgendaDeleteError: string;

    // Toast messages — gallery
    toastPhotoTitleRequired: string;
    toastPhotoFileRequired: string;
    toastPhotoUpdated: string;
    toastPhotoCreated: string;
    toastPhotoUploadError: string;
    toastPhotoDeleted: string;
    toastPhotoDeleteError: string;

    // Toast messages — members
    toastMemberRequired: string;
    toastMemberUpdated: string;
    toastMemberCreated: string;
    toastMemberSaveError: string;
    toastMemberDeleted: string;
    toastMemberDeleteError: string;

    // Toast messages — organization
    toastOrgUpdated: string;
    toastOrgSaveError: string;

    // Toast messages — schedule
    toastScheduleRequired: string;
    toastScheduleUpdated: string;
    toastScheduleCreated: string;
    toastScheduleSaveError: string;
    toastScheduleDeleted: string;
    toastScheduleDeleteError: string;

    // Toast messages — announcements
    toastAnnouncementRequired: string;
    toastAnnouncementUpdated: string;
    toastAnnouncementCreated: string;
    toastAnnouncementPublishError: string;
    toastAnnouncementDeleted: string;
    toastAnnouncementDeleteError: string;

    // Toast messages — announcements (extra)
    toastAnnouncementPublishSuccess: string;
    toastAnnouncementUnpublishSuccess: string;
    toastAnnouncementSaveError: string;

    // Toast messages — theme
    toastThemeSaved: string;
    toastThemeSaveError: string;
    toastFontAdded: string;
    toastFontNotFound: string;
    toastFontRemoved: string;
    toastFontRemoveConfirm: string;

    // Toast messages — invitation
    toastCodeCopyError: string;
    toastCodeLoadError: string;

    // Agenda
    agendaFormTitle: string;
    agendaFormCreateTitle: string;
    agendaEmpty: string;
    agendaPlaceholderCategory: string;
    agendaPlaceholderTitle: string;
    agendaPlaceholderDesc: string;

    // Gallery
    galleryDesc: string;
    galleryFormTitle: string;
    galleryFormCreateTitle: string;
    galleryPlaceholderTitle: string;
    galleryPlaceholderCategory: string;
    galleryPlaceholderDesc: string;
    galleryPreviewLabel: string;

    // Members
    membersDesc: string;
    membersEmpty: string;
    membersPlaceholderPosition: string;
    membersPlaceholderName: string;

    // Organization
    organizationDesc: string;
    organizationPlaceholderGelar: string;
    organizationPlaceholderInstagram: string;
    organizationPlaceholderUrl: string;
    organizationPlaceholderPhone: string;

    // Schedule
    scheduleEmpty: string;
    schedulePlaceholderSubject: string;
    schedulePlaceholderTeacher: string;
    scheduleFormTitle: string;
    scheduleFormCreateTitle: string;
    scheduleLabelDay: string;
    scheduleLabelStart: string;
    scheduleLabelEnd: string;
    scheduleLabelSubject: string;
    scheduleLabelTeacher: string;
    scheduleLabelBreak: string;
    scheduleLabelBreakDesc: string;
    scheduleLabelOrder: string;

    // Announcements
    announcementsPlaceholderCategory: string;
    announcementsPlaceholderTitle: string;
    announcementsPlaceholderSummary: string;
    announcementsPlaceholderBody: string;
    announcementsFormTitle: string;
    announcementsFormCreateTitle: string;

    // Users management
    usersTitle: string;
    usersDescription: string;
    usersEmpty: string;
    usersNameFallback: string;
    usersNoName: string;
    toastUsersLoadError: string;
    toastUsersRoleUpdateError: string;
    toastThemeFontSelect: string;
    toastThemeFontSelected: string;
    usersRoleConfirmTitle: string;
    usersRoleConfirmLabel: string;
    usersRoleConfirmDesc: string;
    usersRoleToastSuccess: string;
    usersColUser: string;
    usersColEmail: string;
    usersColRegistered: string;
    usersColCurrentRole: string;
    usersColChangeRole: string;
    usersSelfTag: string;
    usersSelfLocked: string;
    usersRoleMember: string;
    usersRoleAdmin: string;
    usersRoleOwner: string;

    // Organization form
    orgSectionIdentity: string;
    orgLabelClassName: string;
    orgLabelSchoolName: string;
    orgLabelMajorFull: string;
    orgLabelMajorAbbr: string;
    orgLabelAcademicYear: string;
    orgLabelSemester: string;
    orgLabelRoom: string;
    orgLabelStudentCount: string;
    orgLabelAddress: string;
    orgSectionHomeroom: string;
    orgLabelHomeroomName: string;
    orgLabelDegree: string;
    orgLabelRoleDesc: string;
    orgSectionContact: string;
    orgLabelInstagramUser: string;
    orgLabelInstagramLink: string;
    orgLabelEmail: string;
    orgLabelWhatsApp: string;

    // announcements
    announcementsDesc: string;
    announcementsTableSearch: string;
    announcementsTableCategory: string;
    announcementsTableTitle: string;
    announcementsTableStatus: string;
    announcementsTableAction: string;
    announcementsEmpty: string;

    // agenda
    agendaDesc: string;
    agendaTableDate: string;
    agendaTableCategory: string;
    agendaTableDesc: string;
    agendaTableAction: string;

    // schedule
    scheduleDesc: string;
    scheduleDayMonday: string;
    scheduleDayTuesday: string;
    scheduleDayWednesday: string;
    scheduleDayThursday: string;
    scheduleDayFriday: string;
    scheduleTableOrder: string;
    scheduleTableTime: string;
    scheduleTableSubject: string;
    scheduleTableTeacher: string;
    scheduleTableAction: string;

    // invitation codes (Owner-only)
    invitations: string;
    invitationsDesc: string;
    invitationsCreateBtn: string;
    invitationsCreatedToast: string;
    invitationsCreatedToastFail: string;
    invitationsCopyBtn: string;
    invitationsCopied: string;
    invitationsCode: string;
    invitationsCreated: string;
    invitationsExpires: string;
    invitationsStatus: string;
    invitationsUsedBy: string;
    invitationsUsedAt: string;
    invitationsStatusActive: string;
    invitationsStatusUsed: string;
    invitationsStatusExpired: string;
    invitationsEmpty: string;
    invitationsOnceNote: string;
    invitationsActive: string;
    invitationsGenerateError: string;
  };
  common: {
    save: string;
    cancel: string;
    loading: string;
    error: string;
    empty: string;
    all: string;
    close: string;
    confirm: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    back: string;
    next: string;
    required: string;
    optional: string;
    yes: string;
    no: string;
    noteLabel: string;
  };
  footer: {
    explore: string;
    contactSocial: string;
    copyright: string;
    sampleData: string;
    academicYear: string;
    description: string;
  };
}
