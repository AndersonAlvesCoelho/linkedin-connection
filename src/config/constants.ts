const browserConstants = {
  pages: {
    feed: "https://www.linkedin.com/feed/",
    hashtag: "https://www.linkedin.com/feed/hashtag/{{hashtag}}/",
    search:
      "https://www.linkedin.com/search/results/{{category}}/?keywords={{search}}",
  },
  login: {
    url: "https://www.linkedin.com/login",
    email: "input[id=username]",
    password: "input[id=password]",
    submit: "button[data-litms-control-urn='login-submit']",
  },
  like: {
    btnsOfPost:
      "button.artdeco-button.artdeco-button--muted.artdeco-button--4.artdeco-button--tertiary.ember-view.social-actions-button.react-button__trigger[aria-pressed='false']",
    btnShowMorePosts:
      ".artdeco-button.artdeco-button--muted.artdeco-button--1.artdeco-button--full.artdeco-button--secondary.ember-view.scaffold-finite-scroll__load-button",
  },
  chat: {
    btnChat: ".msg-overlay-bubble-header__control--new-convo-btn",
    btnChatIsClose: "[data-test-icon='chevron-up-small']",
    btnChatIsOpen: "[data-test-icon='chevron-down-small']",
  },
  connect: {
    url: 'https://www.linkedin.com/search/results/people/?activelyHiring=%22true%22&geoUrn=%5B"106057199"%5D&keywords={{term}}',
    connectButton: `button[aria-label*="Convidar"]`,
    getName: (value) => value.split(" ")[1],
    btnNoSendNote: `button[aria-label*="sem nota"]`,
    actions: {
      btnAddNote: `button[aria-label="Adicionar nota"]`,
      inputNote: "textarea[name='message']",
      btnSendNote: "button[aria-label*='Enviar convite']",
    },
  },
  followers: {
    btnFollow: "button[aria-label*='Seguir']",
    nextPage: "button[aria-label='Avançar']",
  },
  jobs: {
    jobSearchUrl: "https://www.linkedin.com/jobs/search/?keywords={{term}}",
    applyButton: "button.jobs-apply-button",
    questionnaireSelectors: [
      'input[type="text"]',
      'input[type="number"]',
      "textarea",
      "select",
    ],
    modalButtons: [
      "button[data-easy-apply-next-button]",
      'button[data-control-name="continue_unify"]',
      'button[aria-label="Revise sua candidatura"]',
      'button[aria-label="Enviar sua candidatura"]',
      'button[aria-label="Avançar para próxima etapa"]',
    ],
    nextPage: "button.artdeco-pagination__button--next",
  },
};
export { browserConstants };
