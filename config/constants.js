const browserConstants = {
  url: "https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin ",
  submitLogin: "button[data-litms-control-urn='login-submit']",
  buttonsPost:
    "button.artdeco-button.artdeco-button--muted.artdeco-button--4.artdeco-button--tertiary.ember-view.social-actions-button.react-button__trigger[aria-pressed='false']",
  buttonShowMorePosts:
    ".artdeco-button.artdeco-button--muted.artdeco-button--1.artdeco-button--full.artdeco-button--secondary.ember-view.scaffold-finite-scroll__load-button",
  buttonChat: ".msg-overlay-bubble-header__control--new-convo-btn",
  buttonChatIsClose: "[data-test-icon='chevron-up-small']",
  buttonChatIsOpen: "[data-test-icon='chevron-down-small']",

  profile: {
    link: ``,
  },
  connect: {
    // pegar todos os botões de conectar
    url: 'https://www.linkedin.com/search/results/people/?activelyHiring=%22true%22&geoUrn=%5B"106057199"%5D&keywords={{term}}',
    connectButton: `button[aria-label*="Convidar"]`, // by class ".artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view"
    getName: (value) => value.split(" ")[1], // << value = item do connectButton
    btnNoSendNote: `button[aria-label*="sem nota"]`,
    actions: {
      btnAddNote: `button[aria-label="Adicionar nota"]`, // by class .artdeco-button.artdeco-button--muted.artdeco-button--2.artdeco-button--secondary.ember-view.mr1
      inputNote: "textarea[name='message']",
      btnSendNote: "button[aria-label*='Enviar convite']", // by class .artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1
    },
  },
  followers: "button[aria-label*='Seguir']", // `.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view` ou "button[aria-label*='para se conectar']"
  nextPage: "button[aria-label='Avançar']",
  jobs: {
    jobSearchUrl: 'https://www.linkedin.com/jobs/search/?keywords={{term}}',
    applyButton: 'button.jobs-apply-button',
    questionnaireSelectors: [
      'input[type="text"]',
      'input[type="number"]',
      'textarea',
      'select'
    ],
    modalButtons: [
      'button[data-easy-apply-next-button]',
      'button[data-control-name="continue_unify"]',
      'button[aria-label="Revise sua candidatura"]',
      'button[aria-label="Enviar sua candidatura"]',
      'button[aria-label="Avançar para próxima etapa"]'
    ],
    nextPage: 'button.artdeco-pagination__button--next',
  },
};
export { browserConstants };
