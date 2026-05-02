const STORAGE_KEY = "tax-document-tracker-v1";
const CASE_STORAGE_KEY = "tax-document-tracker-case-id";
const DEFAULT_CASE_TITLE = "종합소득세 서류 관리";

const PEOPLE = ["이윤하", "오명숙", "이훈경", "이훈"];

const STATUS = {
  todo: "미완료",
  progress: "진행중",
  done: "완료",
  na: "해당없음",
};
const SORT_VALUES = ["person", "category", "status", "title"];

const CATEGORIES = [
  { key: "core", label: "기본/신고" },
  { key: "income", label: "소득자료" },
  { key: "business", label: "사업/프리랜서" },
  { key: "rental", label: "부동산임대" },
  { key: "deduction", label: "공제/감면" },
  { key: "family", label: "가족/인적공제" },
  { key: "tax-request", label: "세무사 추가요청" },
];

const DEFAULT_REQUIRED = {
  "local-tax": "all",
  "real-estate-tax": "all",
  "loan-payment": "all",
  "insurance-payment": "all",
  donation: "all",
  "personal-change": "all",
  medical: ["오명숙", "이윤하"],
};

const DETAIL_REPLACEMENTS = {
  "변경사항이 있으면 주민등록등본, 가족관계증명서 등 관련 증빙 준비. 없으면 해당없음으로 표시.":
    "변경사항이 있으면 주민등록등본, 가족관계증명서 등 관련 증빙 준비. 없으면 업로드하지 않아도 됩니다.",
  "전자기부금영수증과 별도 기부금영수증을 모두 확인. 없으면 해당없음으로 표시.":
    "전자기부금영수증과 별도 기부금영수증을 모두 확인. 없으면 업로드하지 않아도 됩니다.",
};

const DEFAULT_TEMPLATES = [
  {
    key: "tax-help",
    category: "core",
    title: "종합소득세 신고 안내문·신고도움자료",
    issuer: "홈택스",
    detail: "홈택스 종합소득세 신고도움서비스, 모두채움 안내문, 안내받은 신고유형을 확인.",
  },
  {
    key: "tax-return-form",
    category: "core",
    title: "종합소득세·지방소득세 신고서 및 납부계산서",
    issuer: "홈택스 / 위택스 / 세무대리인",
    detail: "신고서 자체는 보통 세무대리인이 작성하지만, 최종 제출 전 신고서와 납부서 확인용으로 관리.",
  },
  {
    key: "previous-return",
    category: "core",
    title: "전년도 신고서·결산서·장부",
    issuer: "기존 세무대리인 / 보관자료",
    detail: "전년도 종합소득세 신고서, 재무제표, 간편장부, 조정계산서가 있으면 준비.",
  },
  {
    key: "personal-change",
    category: "core",
    title: "주소지·결혼·자녀출생 등 변경사항",
    issuer: "정부24 / 주민센터",
    detail: "변경사항이 있으면 주민등록등본, 가족관계증명서 등 관련 증빙 준비. 없으면 업로드하지 않아도 됩니다.",
  },
  {
    key: "earned-income",
    category: "income",
    title: "근로소득 원천징수영수증",
    issuer: "회사 / 홈택스",
    detail: "근로소득이 있거나 연말정산 후 추가 신고가 필요한 경우 준비.",
  },
  {
    key: "business-income-statement",
    category: "income",
    title: "사업소득 지급명세서·원천징수영수증",
    issuer: "거래처 / 홈택스",
    detail: "프리랜서 3.3% 원천징수, 인적용역, 플랫폼 사업소득 등 지급명세서 확인.",
  },
  {
    key: "other-income-statement",
    category: "income",
    title: "기타소득 지급명세서",
    issuer: "지급처 / 홈택스",
    detail: "강연료, 원고료, 일시적 용역 등 기타소득이 있으면 준비.",
  },
  {
    key: "pension-income-statement",
    category: "income",
    title: "연금소득 원천징수영수증",
    issuer: "연금기관 / 홈택스",
    detail: "공적연금, 사적연금 등 연금소득 신고가 필요한 경우 준비.",
  },
  {
    key: "financial-income",
    category: "income",
    title: "금융소득 이자·배당 원천징수영수증",
    issuer: "은행 / 증권사 / 홈택스",
    detail: "이자·배당소득 자료, 배당세액공제 관련 자료, 금융소득 종합과세 해당 여부 확인.",
  },
  {
    key: "foreign-income",
    category: "income",
    title: "국외소득·외국납부세액 자료",
    issuer: "해외 지급처 / 해외 세무기관",
    detail: "해외 소득, 해외 원천징수·납부세액, 환율 적용 근거 등 외국납부세액공제 검토 자료.",
  },
  {
    key: "religious-income",
    category: "income",
    title: "종교인소득 지급명세서·연말정산 자료",
    issuer: "종교단체 / 홈택스",
    detail: "종교인소득이 있으면 지급명세서와 연말정산 여부 확인.",
  },
  {
    key: "business-registration",
    category: "business",
    title: "사업자등록증·사업장 기본정보",
    issuer: "홈택스 / 세무서",
    detail: "사업자등록번호, 업종, 사업장 주소, 휴폐업 여부, 공동사업 여부 확인.",
  },
  {
    key: "double-entry-books",
    category: "business",
    title: "복식부기 재무제표·시산표·조정계산서",
    issuer: "회계프로그램 / 세무대리인",
    detail: "복식부기의무자는 재무상태표, 손익계산서와 부속서류, 합계잔액시산표, 조정계산서 준비.",
  },
  {
    key: "simple-books",
    category: "business",
    title: "간편장부·간편장부 소득금액계산서",
    issuer: "장부 / 회계프로그램",
    detail: "간편장부대상자는 수입금액, 필요경비, 고정자산, 인건비 등을 정리.",
  },
  {
    key: "estimated-income",
    category: "business",
    title: "추계소득금액계산서·경비율 신고 자료",
    issuer: "홈택스 / 세무대리인",
    detail: "기준경비율 또는 단순경비율로 신고하는 경우 수입금액과 주요경비 자료 확인.",
  },
  {
    key: "sales-data",
    category: "business",
    title: "매출 자료",
    issuer: "홈택스 / 카드사 / 플랫폼",
    detail: "세금계산서, 계산서, 현금영수증, 카드매출, 온라인 플랫폼 정산서, 현금매출 내역.",
  },
  {
    key: "purchase-expense",
    category: "business",
    title: "매입·비용 증빙",
    issuer: "홈택스 / 카드사 / 거래처",
    detail: "매입 세금계산서·계산서, 현금영수증, 사업용 카드 사용내역, 일반 영수증.",
  },
  {
    key: "business-bank",
    category: "business",
    title: "사업용 계좌·통장 거래내역",
    issuer: "은행",
    detail: "사업용 계좌 입출금 내역, 수입·비용 입증이 필요한 거래 메모.",
  },
  {
    key: "rent-utilities",
    category: "business",
    title: "사업장 임차료·관리비·공과금·통신비",
    issuer: "임대인 / 관리사무소 / 통신사",
    detail: "사무실·매장 임차료, 관리비, 전기·수도·가스, 인터넷·전화 요금 증빙.",
  },
  {
    key: "payroll",
    category: "business",
    title: "인건비·원천세·4대보험 자료",
    issuer: "홈택스 / 4대사회보험 / 급여대장",
    detail: "급여대장, 원천세 신고서, 지급명세서, 4대보험 납부내역, 일용직·프리랜서 지급자료.",
  },
  {
    key: "vehicle-expense",
    category: "business",
    title: "차량유지비·운행기록·리스/렌트료",
    issuer: "카드사 / 리스·렌트사 / 주유소",
    detail: "사업 관련 차량 비용, 운행기록부, 자동차보험, 리스·렌트 계약 및 납입내역.",
  },
  {
    key: "marketing-office",
    category: "business",
    title: "광고비·접대비·교육훈련비·소모품비",
    issuer: "거래처 / 카드사",
    detail: "사업 관련 판매관리비 증빙. 접대비는 거래처와 목적 메모를 함께 관리.",
  },
  {
    key: "business-loan-interest",
    category: "business",
    title: "사업 관련 대출이자·수수료 금융비용",
    issuer: "은행 / 카드사",
    detail: "사업자금 대출 이자, 지급수수료, 카드수수료 등 금융비용 자료.",
  },
  {
    key: "sincere-report",
    category: "business",
    title: "성실신고확인서·확인비용 세액공제 자료",
    issuer: "세무대리인",
    detail: "성실신고확인대상사업자는 확인서와 확인비용 세액공제 신청 자료 준비.",
  },
  {
    key: "joint-business",
    category: "business",
    title: "공동사업자별 분배명세서",
    issuer: "공동사업 장부 / 세무대리인",
    detail: "공동사업자가 있으면 지분율, 수입·비용 배분, 대표공동사업자 정보를 확인.",
  },
  {
    key: "receipt-list",
    category: "business",
    title: "영수증수취명세서",
    issuer: "보관 영수증 / 세무대리인",
    detail: "법정증빙 외 영수증 수취분을 정리해야 하는 경우 준비.",
  },
  {
    key: "loss-carryback",
    category: "business",
    title: "결손금소급공제세액환급신청서",
    issuer: "세무대리인",
    detail: "결손금 소급공제 환급을 검토하는 경우 신청서와 관련 계산자료 준비.",
  },
  {
    key: "lease-contract",
    category: "rental",
    title: "임대차계약서",
    issuer: "임대인 보관자료",
    detail: "주택·상가·토지 등 임대 물건별 계약서, 갱신계약서, 특약사항 포함.",
  },
  {
    key: "rental-income",
    category: "rental",
    title: "임대료 입금내역·월세 수입내역",
    issuer: "은행 / 임대관리 시스템",
    detail: "물건별 월세, 관리비 수입, 미수·선수금 내역을 구분.",
  },
  {
    key: "rental-deposit",
    category: "rental",
    title: "보증금 내역·간주임대료 산정자료",
    issuer: "임대차계약서 / 은행",
    detail: "물건별 보증금, 변동일, 계좌 입출금, 간주임대료 검토 자료.",
  },
  {
    key: "property-register",
    category: "rental",
    title: "등기사항증명서·건축물대장·토지대장",
    issuer: "인터넷등기소 / 정부24",
    detail: "임대 물건의 소유권, 면적, 용도, 토지·건물 구분 확인.",
  },
  {
    key: "local-tax",
    category: "rental",
    title: "지방세 세목별 과세증명서",
    issuer: "정부24 / 구청",
    detail: "지역별 모두 준비. 토지 재산세 내역은 구청에 상세내역 요청.",
  },
  {
    key: "real-estate-tax",
    category: "rental",
    title: "종합부동산세 내역",
    issuer: "홈택스 / 구청",
    detail: "주택분 과세대상 물건명세서는 구청 발급본으로 준비.",
  },
  {
    key: "property-tax-payment",
    category: "rental",
    title: "재산세·종합부동산세 납부내역",
    issuer: "위택스 / 홈택스 / 지자체",
    detail: "임대 물건 관련 재산세, 종합부동산세, 지방교육세 등 납부 자료.",
  },
  {
    key: "loan-payment",
    category: "rental",
    title: "물건별 대출금 원리금·이자 납입내역",
    issuer: "각 은행",
    detail: "임대 물건별, 은행별 대출 원금·이자 납입내역을 모두 준비.",
  },
  {
    key: "rental-repair",
    category: "rental",
    title: "수선비·관리비·중개수수료 증빙",
    issuer: "관리사무소 / 공사업체 / 중개사",
    detail: "임대 물건 수선비, 관리비, 중개수수료, 공용비, 임대관리 수수료 등.",
  },
  {
    key: "insurance-payment",
    category: "rental",
    title: "건물 화재보험·자동차보험 납입내역",
    issuer: "보험사",
    detail: "임대 건물 화재보험 또는 사업·임대 관련 자동차보험 납입내역.",
  },
  {
    key: "year-end-pdf",
    category: "deduction",
    title: "연말정산 간소화 PDF 전체",
    issuer: "국세청 홈택스",
    detail: "보험료, 의료비, 교육비, 기부금, 신용카드 등 사용금액, 연금계좌 등 공제자료를 한 번에 확인.",
  },
  {
    key: "insurance-deduction",
    category: "deduction",
    title: "보험료납입증명서·보험료납입영수증",
    issuer: "보험사 / 홈택스",
    detail: "보장성보험, 장애인전용보험 등 소득·세액공제 검토용 보험료 증빙.",
  },
  {
    key: "medical",
    category: "deduction",
    title: "의료비 연말정산 PDF",
    issuer: "국세청 연말정산 간소화",
    detail: "의료비지급명세서 또는 간소화 PDF. 소득의 3% 초과 등 적용요건은 세무대리인과 확인.",
  },
  {
    key: "education",
    category: "deduction",
    title: "교육비납입증명서",
    issuer: "학교 / 교육기관 / 홈택스",
    detail: "교육비납입증명서, 방과후 학교 수업용 도서 구입 증명서 등.",
  },
  {
    key: "donation",
    category: "deduction",
    title: "기부금명세서·기부금영수증",
    issuer: "기부처 / 국세청",
    detail: "전자기부금영수증과 별도 기부금영수증을 모두 확인. 없으면 업로드하지 않아도 됩니다.",
  },
  {
    key: "pension-saving",
    category: "deduction",
    title: "연금저축·퇴직연금·IRP 납입증명서",
    issuer: "금융기관 / 홈택스",
    detail: "연금계좌세액공제 검토용 납입증명서.",
  },
  {
    key: "housing-loan-deduction",
    category: "deduction",
    title: "주택자금 공제 서류",
    issuer: "은행 / 등기소 / 분양사",
    detail: "장기주택저당차입금 이자상환증명서, 분양계약서, 등기사항증명서, 주민등록등본 등.",
  },
  {
    key: "housing-saving",
    category: "deduction",
    title: "주택마련저축 납입증명서",
    issuer: "은행 / 홈택스",
    detail: "청약저축 등 주택마련저축 공제 검토용 납입자료.",
  },
  {
    key: "credit-card-use",
    category: "deduction",
    title: "신용카드 등 사용금액 확인자료",
    issuer: "홈택스 / 카드사",
    detail: "신용카드, 체크카드, 현금영수증, 전통시장, 대중교통 등 사용금액 자료.",
  },
  {
    key: "yellow-umbrella",
    category: "deduction",
    title: "소기업·소상공인 공제부금 납입증명서",
    issuer: "노란우산 / 홈택스",
    detail: "소기업·소상공인 공제부금 소득공제 검토용 납입자료.",
  },
  {
    key: "tax-reduction",
    category: "deduction",
    title: "세액감면신청서·공제감면 증빙",
    issuer: "세무대리인 / 관련 기관",
    detail: "중소기업특별세액감면, 창업·투자·고용 관련 공제감면 등 해당 시 준비.",
  },
  {
    key: "family-register",
    category: "family",
    title: "주민등록등본·가족관계증명서",
    issuer: "정부24 / 주민센터",
    detail: "기본공제, 부양가족, 주소지, 세대 구성, 혼인·출생 등 변경사항 확인.",
  },
  {
    key: "disabled-proof",
    category: "family",
    title: "장애인증명서·장애인등록증",
    issuer: "정부24 / 복지로 / 병원",
    detail: "장애인공제 대상자가 있으면 준비.",
  },
  {
    key: "recipient-proof",
    category: "family",
    title: "수급자증명서",
    issuer: "정부24 / 주민센터",
    detail: "수급자 공제 대상자가 있으면 준비.",
  },
  {
    key: "adoption-foster",
    category: "family",
    title: "입양·위탁아동 증빙",
    issuer: "정부24 / 관련 기관",
    detail: "입양관계증명서, 입양증명서, 가정위탁보호확인서 등 해당 시 준비.",
  },
  {
    key: "temporary-move",
    category: "family",
    title: "일시퇴거자 동거가족상황표",
    issuer: "세무대리인 / 보관자료",
    detail: "취학, 요양, 근무 등으로 일시퇴거한 부양가족이 있으면 준비.",
  },
  {
    key: "marriage-credit",
    category: "family",
    title: "혼인세액공제 증빙",
    issuer: "정부24 / 가족관계등록기관",
    detail: "혼인세액공제 검토가 필요한 경우 혼인관계증명서 등 증빙 준비.",
  },
];

const elements = {
  entryScreen: document.querySelector("#entryScreen"),
  entryEyebrow: document.querySelector("#entryEyebrow"),
  entryTitle: document.querySelector("#entryTitle"),
  appEyebrow: document.querySelector("#appEyebrow"),
  appTitle: document.querySelector("#appTitle"),
  startAccountantButton: document.querySelector("#startAccountantButton"),
  familyLinkInput: document.querySelector("#familyLinkInput"),
  openFamilyLinkButton: document.querySelector("#openFamilyLinkButton"),
  caseSettings: document.querySelector("#caseSettings"),
  caseTitleInput: document.querySelector("#caseTitleInput"),
  taxYearInput: document.querySelector("#taxYearInput"),
  filingYearInput: document.querySelector("#filingYearInput"),
  filingMonthInput: document.querySelector("#filingMonthInput"),
  doneMetric: document.querySelector("#doneMetric"),
  activeMetric: document.querySelector("#activeMetric"),
  todoMetric: document.querySelector("#todoMetric"),
  progressMetric: document.querySelector("#progressMetric"),
  peopleStrip: document.querySelector("#peopleStrip"),
  requestedModeButton: document.querySelector("#requestedModeButton"),
  catalogModeButton: document.querySelector("#catalogModeButton"),
  personFilter: document.querySelector("#personFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  categoryFilter: document.querySelector("#categoryFilter"),
  searchInput: document.querySelector("#searchInput"),
  sortSelect: document.querySelector("#sortSelect"),
  taskCountTitle: document.querySelector("#taskCountTitle"),
  taskList: document.querySelector("#taskList"),
  emptyState: document.querySelector("#emptyState"),
  addTaskButton: document.querySelector("#addTaskButton"),
  copyFamilyLinkButton: document.querySelector("#copyFamilyLinkButton"),
  catalogActions: document.querySelector("#catalogActions"),
  requestVisibleButton: document.querySelector("#requestVisibleButton"),
  unrequestVisibleButton: document.querySelector("#unrequestVisibleButton"),
  resetButton: document.querySelector("#resetButton"),
  copySummaryButton: document.querySelector("#copySummaryButton"),
  exportButton: document.querySelector("#exportButton"),
  importInput: document.querySelector("#importInput"),
  printButton: document.querySelector("#printButton"),
  compactViewButton: document.querySelector("#compactViewButton"),
  detailViewButton: document.querySelector("#detailViewButton"),
  taskDialog: document.querySelector("#taskDialog"),
  taskForm: document.querySelector("#taskForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  editingTaskId: document.querySelector("#editingTaskId"),
  taskPerson: document.querySelector("#taskPerson"),
  taskCategory: document.querySelector("#taskCategory"),
  taskTitle: document.querySelector("#taskTitle"),
  taskIssuer: document.querySelector("#taskIssuer"),
  taskDetail: document.querySelector("#taskDetail"),
  taskNote: document.querySelector("#taskNote"),
  deleteTaskButton: document.querySelector("#deleteTaskButton"),
  toast: document.querySelector("#toast"),
};

let appRole = getInitialRole();
let caseId = getInitialCaseId();
let state = loadState();
let toastTimer;
let saveTimer;
let isLoadingRemote = false;

function getDefaultCaseSettings() {
  const filingYear = new Date().getFullYear();
  return {
    title: DEFAULT_CASE_TITLE,
    taxYear: String(filingYear - 1),
    filingYear: String(filingYear),
    filingMonth: "5",
  };
}

function normalizeCaseSettings(settings = {}) {
  const fallback = getDefaultCaseSettings();
  const filingMonth = Number(settings.filingMonth);

  return {
    title: String(settings.title || "").trim() || fallback.title,
    taxYear: normalizeYear(settings.taxYear) || fallback.taxYear,
    filingYear: normalizeYear(settings.filingYear) || fallback.filingYear,
    filingMonth: filingMonth >= 1 && filingMonth <= 12 ? String(filingMonth) : fallback.filingMonth,
  };
}

function normalizeYear(value) {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) return "";
  return String(year);
}

function createDefaultState() {
  const tasks = [];
  PEOPLE.forEach((person) => {
    DEFAULT_TEMPLATES.forEach((template, index) => {
      if (template.people && !template.people.includes(person)) return;
      tasks.push({
        id: makeId(),
        templateKey: template.key,
        category: template.category,
        order: index,
        person,
        title: template.title,
        issuer: template.issuer,
        detail: template.detail,
        required: isDefaultRequired(person, template.key),
        status: "todo",
        due: "",
        note: "",
        files: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });

  return {
    settings: getDefaultCaseSettings(),
    people: PEOPLE,
    tasks,
    filters: {
      person: "all",
      status: "all",
      category: "all",
      search: "",
      sort: "category",
    },
    mode: "requested",
    viewMode: "compact",
  };
}

function loadState() {
  const fallback = createDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.tasks) || !Array.isArray(parsed.people)) return fallback;
    const migrated = {
      ...fallback,
      ...parsed,
      settings: normalizeCaseSettings(parsed.settings),
      filters: { ...fallback.filters, ...(parsed.filters || {}) },
      people: unique([...PEOPLE, ...parsed.people]),
      tasks: parsed.tasks.map(normalizeTask),
    };
    migrated.mode = migrated.mode === "catalog" ? "catalog" : "requested";
    migrated.tasks = mergeMissingTemplateTasks(migrated);
    return migrated;
  } catch {
    return fallback;
  }
}

function getInitialRole() {
  const role = new URLSearchParams(window.location.search).get("role");
  if (role === "family" || role === "accountant") return role;
  return null;
}

function getInitialCaseId() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("case");
  if (fromUrl) {
    localStorage.setItem(CASE_STORAGE_KEY, fromUrl);
    return fromUrl;
  }

  return localStorage.getItem(CASE_STORAGE_KEY) || "";
}

function makeCaseId() {
  const bytes = new Uint8Array(12);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function normalizeTask(task) {
  const template = templateByKey(task.templateKey);
  return {
    id: task.id || makeId(),
    templateKey: task.templateKey || "custom",
    order: template ? templateOrder(task.templateKey) : Number.isFinite(task.order) ? task.order : 999,
    category: categoryExists(task.category) ? task.category : template?.category || "core",
    person: task.person || PEOPLE[0],
    title: task.title || "새 서류",
    issuer: task.issuer || "",
    detail: normalizeDetail(task.detail || ""),
    required: inferRequired(task, template),
    status: STATUS[task.status] ? task.status : "todo",
    due: task.due || "",
    note: task.note || "",
    files: Array.isArray(task.files) ? uniqueFiles(task.files.map(normalizeFile)) : [],
    createdAt: task.createdAt || new Date().toISOString(),
    updatedAt: task.updatedAt || new Date().toISOString(),
  };
}

function inferRequired(task, template) {
  if (typeof task.required === "boolean") return task.required;
  if (!template || task.templateKey === "custom") return true;
  if (task.status && task.status !== "todo") return true;
  if (task.due || task.note || (Array.isArray(task.files) && task.files.length > 0)) return true;
  return isDefaultRequired(task.person || PEOPLE[0], task.templateKey);
}

function normalizeDetail(detail) {
  return DETAIL_REPLACEMENTS[detail] || detail;
}

function mergeMissingTemplateTasks(baseState) {
  const now = new Date().toISOString();
  const existingKeys = new Set(baseState.tasks.map((task) => `${task.person}::${task.templateKey}`));
  const additions = [];

  baseState.people.forEach((person) => {
    DEFAULT_TEMPLATES.forEach((template, index) => {
      if (template.people && !template.people.includes(person)) return;
      const key = `${person}::${template.key}`;
      if (existingKeys.has(key)) return;
      additions.push({
        id: makeId(),
        templateKey: template.key,
        category: template.category,
        order: index,
        person,
        title: template.title,
        issuer: template.issuer,
        detail: template.detail,
        required: isDefaultRequired(person, template.key),
        status: "todo",
        due: "",
        note: "",
        files: [],
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  return [...baseState.tasks, ...additions];
}

function templateByKey(key) {
  return DEFAULT_TEMPLATES.find((template) => template.key === key);
}

function templateOrder(key) {
  const index = DEFAULT_TEMPLATES.findIndex((template) => template.key === key);
  return index >= 0 ? index : 999;
}

function categoryExists(key) {
  return CATEGORIES.some((category) => category.key === key);
}

function categoryLabel(key) {
  return CATEGORIES.find((category) => category.key === key)?.label || "기본/신고";
}

function isDefaultRequired(person, templateKey) {
  const rule = DEFAULT_REQUIRED[templateKey];
  if (rule === "all") return true;
  if (Array.isArray(rule)) return rule.includes(person);
  return false;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleRemoteSave();
}

function remoteEnabled() {
  return Boolean(caseId) && window.location.protocol.startsWith("http") && !["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function scheduleRemoteSave() {
  if (!remoteEnabled() || isLoadingRemote) return;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(saveCaseState, 500);
}

async function loadRemoteCase() {
  if (!remoteEnabled()) return;
  isLoadingRemote = true;
  try {
    const response = await fetch(`/api/case?id=${encodeURIComponent(caseId)}`);
    if (response.status === 404) return;
    if (!response.ok) throw new Error("Case load failed");
    const remoteState = await response.json();
    if (Array.isArray(remoteState.tasks) && Array.isArray(remoteState.people)) {
      const fallback = createDefaultState();
      state = {
        ...fallback,
        ...remoteState,
        settings: normalizeCaseSettings(remoteState.settings),
        filters: { ...fallback.filters, ...(state.filters || {}) },
        people: unique([...PEOPLE, ...remoteState.people]),
        tasks: remoteState.tasks.map(normalizeTask),
      };
      state.tasks = mergeMissingTemplateTasks(state);
    }
  } catch {
    showToast("공유 작업방을 불러오지 못했습니다. 로컬 상태로 표시합니다.");
  } finally {
    isLoadingRemote = false;
  }
}

async function saveCaseState() {
  if (!remoteEnabled()) return;
  try {
    await fetch(`/api/case?id=${encodeURIComponent(caseId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...state,
        savedAt: new Date().toISOString(),
      }),
    });
  } catch {
    showToast("공유 작업방 저장에 실패했습니다.");
  }
}

function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function normalizeFile(file) {
  if (!file) return null;
  if (typeof file === "string") return { name: file };
  return {
    name: file.name || file.pathname || "첨부파일",
    url: file.url || "",
    pathname: file.pathname || "",
    uploadedAt: file.uploadedAt || "",
  };
}

function uniqueFiles(files) {
  const seen = new Set();
  return files.filter((file) => {
    if (!file?.name) return false;
    const key = file.pathname || file.url || file.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function setupSelects() {
  elements.personFilter.innerHTML = [
    '<option value="all">전체</option>',
    ...state.people.map((person) => `<option value="${escapeHtml(person)}">${escapeHtml(person)}</option>`),
  ].join("");
  elements.categoryFilter.innerHTML = [
    '<option value="all">전체</option>',
    ...CATEGORIES.map(
      (category) => `<option value="${escapeHtml(category.key)}">${escapeHtml(category.label)}</option>`,
    ),
  ].join("");
  setTaskPersonOptions(false);
  elements.taskCategory.innerHTML = CATEGORIES.map(
    (category) => `<option value="${escapeHtml(category.key)}">${escapeHtml(category.label)}</option>`,
  ).join("");
}

function setTaskPersonOptions(includeAll) {
  elements.taskPerson.innerHTML = [
    includeAll ? '<option value="all">전체 대상자</option>' : "",
    ...state.people.map((person) => `<option value="${escapeHtml(person)}">${escapeHtml(person)}</option>`),
  ].join("");
}

function renderCaseHeader() {
  state.settings = normalizeCaseSettings(state.settings);
  const label = formatCaseLabel(state.settings);
  document.title = state.settings.title;
  elements.entryEyebrow.textContent = label;
  elements.appEyebrow.textContent = label;
  elements.entryTitle.textContent = state.settings.title;
  elements.appTitle.textContent = state.settings.title;
  elements.caseTitleInput.value = state.settings.title;
  elements.taxYearInput.value = state.settings.taxYear;
  elements.filingYearInput.value = state.settings.filingYear;
  elements.filingMonthInput.value = state.settings.filingMonth;
}

function formatCaseLabel(settings) {
  const parts = [];
  if (settings.taxYear) parts.push(`${settings.taxYear}년 귀속`);
  if (settings.filingYear && settings.filingMonth) parts.push(`${settings.filingYear}년 ${settings.filingMonth}월 신고 준비`);
  return parts.join(" · ") || "신고 준비";
}

function render() {
  renderCaseHeader();
  document.body.dataset.screen = appRole ? "app" : "entry";
  if (!appRole) {
    delete document.body.dataset.role;
    delete document.body.dataset.mode;
    return;
  }

  if (appRole === "family") {
    state.mode = "requested";
    if (state.filters.person === "all" || !state.people.includes(state.filters.person)) {
      state.filters.person = state.people[0];
    }
  }
  document.body.dataset.role = appRole;
  document.body.dataset.mode = state.mode;

  if (!SORT_VALUES.includes(state.filters.sort)) state.filters.sort = "category";
  if (!["all", "todo", "done"].includes(state.filters.status)) state.filters.status = "all";
  elements.personFilter.value = state.mode === "catalog" ? "all" : state.filters.person;
  elements.statusFilter.value = state.mode === "catalog" ? "all" : state.filters.status;
  elements.categoryFilter.value = state.filters.category;
  elements.searchInput.value = state.filters.search;
  elements.sortSelect.value = state.filters.sort;
  elements.requestedModeButton.classList.toggle("is-active", state.mode === "requested");
  elements.catalogModeButton.classList.toggle("is-active", state.mode === "catalog");
  elements.personFilter.disabled = state.mode === "catalog";
  elements.statusFilter.disabled = state.mode === "catalog";
  elements.catalogActions.hidden = state.mode !== "catalog";
  elements.compactViewButton.classList.toggle("is-active", state.viewMode === "compact");
  elements.detailViewButton.classList.toggle("is-active", state.viewMode === "detail");

  renderMetrics();
  renderPeople();
  renderTasks();
  saveState();
}

function renderMetrics() {
  const activeTasks = state.tasks.filter((task) => task.required && task.status !== "na");
  const done = activeTasks.filter((task) => task.status === "done").length;
  const todo = activeTasks.filter((task) => task.status === "todo").length;
  const percent = activeTasks.length ? Math.round((done / activeTasks.length) * 100) : 0;

  elements.doneMetric.textContent = done;
  elements.activeMetric.textContent = activeTasks.length;
  elements.todoMetric.textContent = todo;
  elements.progressMetric.textContent = `${percent}%`;
}

function renderPeople() {
  elements.peopleStrip.innerHTML = state.people
    .map((person) => {
      const tasks = state.tasks.filter((task) => task.person === person && task.required);
      const activeTasks = tasks.filter((task) => task.status !== "na");
      const done = activeTasks.filter((task) => task.status === "done").length;
      const todo = activeTasks.filter((task) => task.status === "todo").length;
      const percent = activeTasks.length ? Math.round((done / activeTasks.length) * 100) : 0;
      const isSelected = state.filters.person === person;

      return `
        <button class="person-card ${isSelected ? "is-selected" : ""}" type="button" data-person-card="${escapeHtml(person)}" aria-pressed="${isSelected}">
          <span class="person-top">
            <strong>${escapeHtml(person)}</strong>
            <span class="person-percent">${percent}%</span>
          </span>
          <span class="progress-bar" aria-hidden="true">
            <span class="progress-fill" style="width: ${percent}%"></span>
          </span>
          <span class="person-stats">
            <span>요청 ${tasks.length}</span>
            <span>완료 ${done}</span>
            <span>미완료 ${todo}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderTasks() {
  const tasks = getVisibleTasks();
  const useGroupedRequests = shouldRenderGroupedRequests();
  const visibleItems = useGroupedRequests ? groupRequestedTasks(tasks) : tasks;
  elements.taskCountTitle.textContent =
    appRole === "family"
      ? `업로드할 서류 ${tasks.length}건`
      : useGroupedRequests
        ? `요청서류 ${visibleItems.length}건`
      : state.mode === "catalog"
        ? `선택 가능 서류 ${tasks.length}건`
        : `요청서류 ${tasks.length}건`;
  elements.emptyState.textContent =
    appRole === "family"
      ? "업로드할 요청서류가 없습니다."
      : state.mode === "catalog"
        ? "조건에 맞는 서류가 없습니다."
        : "요청된 서류가 없습니다. 서류 선택에서 필요한 항목을 요청하세요.";
  elements.emptyState.hidden = visibleItems.length > 0;
  elements.taskList.classList.toggle("is-grouped", useGroupedRequests);
  elements.taskList.innerHTML = visibleItems.map(useGroupedRequests ? renderTaskGroupCard : renderTaskCard).join("");
}

function shouldRenderGroupedRequests() {
  return appRole === "accountant" && state.mode === "requested" && state.filters.person === "all";
}

function groupRequestedTasks(tasks) {
  const groups = new Map();

  tasks.forEach((task) => {
    const key = task.templateKey && task.templateKey !== "custom" ? task.templateKey : `${task.title}::${task.category}::${task.issuer}`;
    if (!groups.has(key)) {
      groups.set(key, {
        id: `group-${key}`,
        templateKey: task.templateKey,
        category: task.category,
        title: task.title,
        issuer: task.issuer,
        detail: task.detail,
        order: task.order ?? 999,
        tasks: [],
      });
    }
    groups.get(key).tasks.push(task);
  });

  return [...groups.values()]
    .map((group) => {
      group.tasks.sort(byPerson);
      group.doneCount = group.tasks.filter((task) => task.status === "done").length;
      group.todoCount = group.tasks.filter((task) => task.status === "todo").length;
      group.fileCount = group.tasks.reduce((sum, task) => sum + task.files.length, 0);
      group.status = group.doneCount === group.tasks.length ? "done" : "todo";
      return group;
    })
    .sort((a, b) => byCategory(a, b) || byOrder(a, b) || a.title.localeCompare(b.title, "ko-KR"));
}

function getVisibleTasks() {
  if (state.mode === "catalog") return getVisibleCatalogItems();

  const search = state.filters.search.trim().toLocaleLowerCase("ko-KR");
  const filtered = state.tasks.filter((task) => {
    if (state.mode === "requested" && !task.required) return false;
    if (state.filters.person !== "all" && task.person !== state.filters.person) return false;
    if (state.mode === "requested" && state.filters.status !== "all" && task.status !== state.filters.status) return false;
    if (state.filters.category !== "all" && task.category !== state.filters.category) return false;
    if (!search) return true;

    return [task.person, categoryLabel(task.category), task.title, task.issuer, task.detail, task.note, ...task.files]
      .join(" ")
      .toLocaleLowerCase("ko-KR")
      .includes(search);
  });

  return filtered.sort((a, b) => {
    if (state.filters.sort === "category") return byCategory(a, b) || byPerson(a, b) || byOrder(a, b);
    if (state.filters.sort === "status") return statusRank(a.status) - statusRank(b.status) || byPerson(a, b) || byOrder(a, b);
    if (state.filters.sort === "title") return a.title.localeCompare(b.title, "ko-KR") || byPerson(a, b);
    return byPerson(a, b) || byOrder(a, b) || a.title.localeCompare(b.title, "ko-KR");
  });
}

function getVisibleCatalogItems() {
  const search = state.filters.search.trim().toLocaleLowerCase("ko-KR");
  const items = DEFAULT_TEMPLATES.map((template, index) => {
    const relatedTasks = state.tasks.filter((task) => task.templateKey === template.key);
    const requestedCount = relatedTasks.filter((task) => task.required).length;
    return {
      id: `catalog-${template.key}`,
      templateKey: template.key,
      category: template.category,
      order: index,
      person: "전체",
      title: template.title,
      issuer: template.issuer,
      detail: template.detail,
      status: requestedCount ? "todo" : "na",
      due: "",
      note: `${state.people.length}명 중 ${requestedCount}명에게 요청됨`,
      files: [],
      required: requestedCount === state.people.length,
      partiallyRequired: requestedCount > 0 && requestedCount < state.people.length,
      requestedCount,
      totalCount: state.people.length,
      isCatalogItem: true,
    };
  });

  const filtered = items.filter((item) => {
    if (state.filters.category !== "all" && item.category !== state.filters.category) return false;
    if (!search) return true;

    return [categoryLabel(item.category), item.title, item.issuer, item.detail, item.note]
      .join(" ")
      .toLocaleLowerCase("ko-KR")
      .includes(search);
  });

  return filtered.sort((a, b) => {
    if (state.filters.sort === "title") return a.title.localeCompare(b.title, "ko-KR");
    return byCategory(a, b) || byOrder(a, b) || a.title.localeCompare(b.title, "ko-KR");
  });
}

function renderTaskCard(task) {
  const note = task.note.trim() || "메모 없음";
  const detail = task.detail.trim() || "상세 없음";
  const statusClass = `is-${task.status}`;
  const compactClass = state.viewMode === "compact" || state.mode === "catalog" ? "compact" : "";
  const requiredClass = task.required || task.partiallyRequired ? "is-required" : "is-unrequested";
  const requestLabel = getRequestLabel(task);
  const editButton =
    appRole === "accountant"
      ? `
          <button class="icon-button" type="button" data-action="edit" title="수정" aria-label="${escapeHtml(task.title)} 수정">
            <span aria-hidden="true">✎</span>
          </button>
        `
      : "";
  const actions =
    state.mode === "catalog"
      ? `
          <label class="request-switch">
            <input type="checkbox" data-action="required" ${task.required ? "checked" : ""} />
            <span>${requestLabel}</span>
          </label>
        `
      : appRole === "family"
        ? ""
      : editButton;
  const fileChips = task.files.length
    ? task.files.map((file) => renderFileChip(file, true)).join("")
    : '<span class="muted">기록된 파일 없음</span>';
  const taskBody =
    appRole === "family"
      ? `
        <div class="task-body family-upload-body">
          <div class="file-tools">
            <div class="file-row">
              <input type="file" multiple data-action="files" aria-label="${escapeHtml(task.title)} 파일 업로드" />
            </div>
            <div class="file-list">${fileChips}</div>
          </div>
          <p class="family-detail">${escapeHtml(detail)}</p>
        </div>
      `
      : `
        <div class="task-body">
          <div class="detail-box">
            <span>상세</span>
            <p>${escapeHtml(detail)}</p>
          </div>
          <div class="file-tools">
            <div class="detail-box">
              <span>메모</span>
              <p>${escapeHtml(note)}</p>
            </div>
            <div class="file-row">
              <input type="file" multiple data-action="files" aria-label="${escapeHtml(task.title)} 파일명 기록" />
            </div>
            <div class="file-list">${fileChips}</div>
          </div>
        </div>
      `;

  return `
    <article class="task-card ${statusClass} ${compactClass} ${requiredClass}" data-task-id="${escapeHtml(task.id)}" data-template-key="${escapeHtml(task.templateKey)}">
      <div class="task-head">
        <div class="task-title">
          <h3>${escapeHtml(task.title)}</h3>
          <div class="task-meta">
            <span class="pill person">${escapeHtml(task.person)}</span>
            <span class="pill category">${escapeHtml(categoryLabel(task.category))}</span>
            <span class="pill ${task.required || task.partiallyRequired ? "requested" : "unrequested"}">${requestLabel}</span>
            ${state.mode === "catalog" ? "" : `<span class="pill ${task.status}">${STATUS[task.status]}</span>`}
            <span>${escapeHtml(task.issuer || "발급처 미정")}</span>
          </div>
        </div>
        <div class="task-actions">
          ${actions}
        </div>
      </div>
      ${taskBody}
    </article>
  `;
}

function renderTaskGroupCard(group) {
  const detail = group.detail.trim() || "상세 없음";
  const fileText = group.fileCount ? `업로드 ${group.fileCount}개` : "업로드 없음";
  const statusText = group.doneCount === group.tasks.length ? "완료" : `${group.doneCount}/${group.tasks.length} 완료`;
  const peopleRows = group.tasks
    .map((task) => {
      const files = task.files.length ? task.files.map((file) => renderFileChip(file, false)).join("") : '<span class="muted">업로드 없음</span>';
      return `
        <div class="group-person-row ${task.status === "done" ? "is-done" : "is-todo"}">
          <div class="group-person-main">
            <strong>${escapeHtml(task.person)}</strong>
            <span class="pill ${task.status}">${STATUS[task.status]}</span>
          </div>
          <div class="group-person-files">${files}</div>
        </div>
      `;
    })
    .join("");

  return `
    <article class="task-card task-group is-required is-${group.status}" data-template-key="${escapeHtml(group.templateKey)}">
      <div class="task-head">
        <div class="task-title">
          <h3>${escapeHtml(group.title)}</h3>
          <div class="task-meta">
            <span class="pill category">${escapeHtml(categoryLabel(group.category))}</span>
            <span class="pill requested">요청됨</span>
            <span class="pill ${group.status}">${escapeHtml(statusText)}</span>
            <span>${escapeHtml(group.issuer || "발급처 미정")}</span>
            <span>${escapeHtml(fileText)}</span>
          </div>
        </div>
      </div>
      <div class="task-body group-body">
        <p class="group-detail">${escapeHtml(detail)}</p>
        <div class="group-people">${peopleRows}</div>
      </div>
    </article>
  `;
}

function renderFileChip(file, allowRemove) {
  const fileName = escapeHtml(file.name || String(file));
  const fileContent = file.url
    ? `<a href="${escapeHtml(file.url)}" target="_blank" rel="noopener" download>${fileName}</a>`
    : `<span>${fileName}</span>`;
  const removeButton = allowRemove
    ? `<button type="button" data-action="remove-file" data-file="${escapeHtml(file.pathname || file.url || file.name)}" title="파일명 삭제" aria-label="${fileName} 삭제">×</button>`
    : "";

  return `
    <span class="file-chip">
      ${fileContent}
      ${removeButton}
    </span>
  `;
}

function getRequestLabel(task) {
  if (task.isCatalogItem) {
    if (task.required) return `전체 요청됨`;
    if (task.partiallyRequired) return `${task.requestedCount}/${task.totalCount} 요청됨`;
    return "미요청";
  }
  return task.required ? "요청됨" : "미요청";
}

async function uploadSelectedFiles(task, selectedFiles) {
  if (!selectedFiles.length) return [];
  if (!remoteEnabled()) {
    return selectedFiles.map((file) => ({ name: file.name, uploadedAt: new Date().toISOString() }));
  }

  const uploadedFiles = [];
  for (const file of selectedFiles) {
    const formData = new FormData();
    formData.append("caseId", caseId);
    formData.append("taskId", task.id);
    formData.append("person", task.person);
    formData.append("title", task.title);
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Upload failed");
    const payload = await response.json();
    uploadedFiles.push(payload.file);
  }
  return uploadedFiles;
}

function statusRank(status) {
  return { todo: 1, progress: 2, done: 3, na: 4 }[status] || 5;
}

function byPerson(a, b) {
  return state.people.indexOf(a.person) - state.people.indexOf(b.person);
}

function byOrder(a, b) {
  return (a.order ?? 999) - (b.order ?? 999);
}

function byCategory(a, b) {
  return categoryRank(a.category) - categoryRank(b.category);
}

function categoryRank(key) {
  const index = CATEGORIES.findIndex((category) => category.key === key);
  return index >= 0 ? index : 999;
}

function bindEvents() {
  elements.startAccountantButton.addEventListener("click", async () => {
    appRole = "accountant";
    caseId = caseId || makeCaseId();
    localStorage.setItem(CASE_STORAGE_KEY, caseId);
    state.mode = "requested";
    state.filters.person = "all";
    updateRoleInUrl();
    await loadRemoteCase();
    state.mode = "requested";
    state.filters.person = "all";
    render();
  });

  elements.openFamilyLinkButton.addEventListener("click", async () => {
    const parsedCaseId = parseCaseId(elements.familyLinkInput.value.trim());
    if (!parsedCaseId) {
      showToast("세무사가 보낸 가족 링크나 작업방 코드를 입력하세요.");
      return;
    }
    appRole = "family";
    caseId = parsedCaseId;
    localStorage.setItem(CASE_STORAGE_KEY, caseId);
    state.mode = "requested";
    updateRoleInUrl();
    await loadRemoteCase();
    if (state.filters.person === "all" || !state.people.includes(state.filters.person)) {
      state.filters.person = state.people[0];
    }
    render();
  });

  elements.requestedModeButton.addEventListener("click", () => {
    state.mode = "requested";
    render();
  });

  elements.catalogModeButton.addEventListener("click", () => {
    state.mode = "catalog";
    render();
  });

  elements.personFilter.addEventListener("change", (event) => {
    state.filters.person = event.target.value;
    render();
  });

  elements.statusFilter.addEventListener("change", (event) => {
    state.filters.status = event.target.value;
    render();
  });

  elements.categoryFilter.addEventListener("change", (event) => {
    state.filters.category = event.target.value;
    render();
  });

  elements.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value;
    render();
  });

  elements.sortSelect.addEventListener("change", (event) => {
    state.filters.sort = event.target.value;
    render();
  });

  [elements.caseTitleInput, elements.taxYearInput, elements.filingYearInput, elements.filingMonthInput].forEach((input) => {
    input.addEventListener("change", updateCaseSettingsFromForm);
  });

  elements.peopleStrip.addEventListener("click", (event) => {
    const card = event.target.closest("[data-person-card]");
    if (!card) return;
    const person = card.dataset.personCard;
    state.filters.person = state.filters.person === person ? "all" : person;
    render();
  });

  elements.taskList.addEventListener("change", async (event) => {
    const taskCard = event.target.closest("[data-task-id]");
    if (!taskCard) return;
    const task = findTask(taskCard.dataset.taskId);

    if (event.target.dataset.action === "required") {
      setTemplateRequired(taskCard.dataset.templateKey, event.target.checked);
      render();
      showToast(event.target.checked ? "모든 대상자에게 요청했습니다." : "모든 대상자에서 요청을 해제했습니다.");
      return;
    }

    if (event.target.dataset.action === "files") {
      if (!task) return;
      const selectedFiles = Array.from(event.target.files || []);
      try {
        const uploadedFiles = await uploadSelectedFiles(task, selectedFiles);
        task.files = uniqueFiles([...task.files, ...uploadedFiles]);
        if (uploadedFiles.length) task.status = "done";
        task.updatedAt = new Date().toISOString();
        render();
        showToast(remoteEnabled() ? "파일을 업로드했습니다." : "파일명을 기록했습니다.");
      } catch {
        showToast("파일 업로드에 실패했습니다.");
      } finally {
        event.target.value = "";
      }
    }
  });

  elements.taskList.addEventListener("click", (event) => {
    const taskCard = event.target.closest("[data-task-id]");
    if (!taskCard) return;
    const task = findTask(taskCard.dataset.taskId);
    if (!task) return;

    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "edit") {
      openTaskDialog(task);
    }

    if (action === "remove-file") {
      const file = event.target.dataset.file;
      task.files = task.files.filter((item) => (item.pathname || item.url || item.name) !== file);
      task.status = task.files.length ? "done" : "todo";
      task.updatedAt = new Date().toISOString();
      render();
    }
  });

  elements.addTaskButton.addEventListener("click", () => openTaskDialog());
  elements.copyFamilyLinkButton.addEventListener("click", copyFamilyLink);
  elements.requestVisibleButton.addEventListener("click", () => setVisibleRequired(true));
  elements.unrequestVisibleButton.addEventListener("click", () => setVisibleRequired(false));
  elements.resetButton.addEventListener("click", resetState);
  elements.copySummaryButton.addEventListener("click", copySummary);
  elements.exportButton.addEventListener("click", exportState);
  elements.importInput.addEventListener("change", importState);
  elements.printButton.addEventListener("click", () => window.print());

  elements.compactViewButton.addEventListener("click", () => {
    state.viewMode = "compact";
    render();
  });

  elements.detailViewButton.addEventListener("click", () => {
    state.viewMode = "detail";
    render();
  });

  elements.taskForm.addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    event.preventDefault();
    saveTaskFromDialog();
  });

  elements.deleteTaskButton.addEventListener("click", deleteCurrentTask);
}

function findTask(id) {
  return state.tasks.find((task) => task.id === id);
}

function updateRoleInUrl() {
  if (!appRole) return;
  caseId = caseId || makeCaseId();
  localStorage.setItem(CASE_STORAGE_KEY, caseId);
  const url = new URL(window.location.href);
  url.searchParams.set("role", appRole);
  url.searchParams.set("case", caseId);
  window.history.replaceState({}, "", url);
}

function parseCaseId(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.searchParams.get("case") || "";
  } catch {
    return /^[a-zA-Z0-9_-]{8,80}$/.test(value) ? value : "";
  }
}

function updateCaseSettingsFromForm() {
  state.settings = normalizeCaseSettings({
    title: elements.caseTitleInput.value,
    taxYear: elements.taxYearInput.value,
    filingYear: elements.filingYearInput.value,
    filingMonth: elements.filingMonthInput.value,
  });
  render();
}

async function copyFamilyLink() {
  caseId = caseId || makeCaseId();
  localStorage.setItem(CASE_STORAGE_KEY, caseId);
  await saveCaseState();
  const url = new URL(window.location.href);
  url.searchParams.set("case", caseId);
  url.searchParams.set("role", "family");
  await copyText(url.toString());
  showToast("가족용 링크를 복사했습니다.");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

function setTemplateRequired(templateKey, required) {
  const now = new Date().toISOString();
  state.tasks.forEach((task) => {
    if (task.templateKey !== templateKey) return;
    task.required = required;
    task.updatedAt = now;
  });
}

function setVisibleRequired(required) {
  const tasks = getVisibleTasks();
  if (!tasks.length) {
    showToast("적용할 서류가 없습니다.");
    return;
  }
  const now = new Date().toISOString();
  const templateKeys = new Set(tasks.map((task) => task.templateKey));
  state.tasks.forEach((task) => {
    if (!templateKeys.has(task.templateKey)) return;
    task.required = required;
    task.updatedAt = now;
  });
  render();
  showToast(required ? `${tasks.length}개 서류를 모든 대상자에게 요청했습니다.` : `${tasks.length}개 서류 요청을 모두 해제했습니다.`);
}

function openTaskDialog(task) {
  const isEdit = Boolean(task);
  elements.dialogTitle.textContent = isEdit ? "항목 수정" : "항목 추가";
  elements.deleteTaskButton.hidden = !isEdit;
  elements.editingTaskId.value = task?.id || "";
  setTaskPersonOptions(!isEdit);
  elements.taskPerson.value = isEdit ? task.person : "all";
  elements.taskCategory.value = task?.category || (state.filters.category !== "all" ? state.filters.category : "tax-request");
  elements.taskTitle.value = task?.title || "";
  elements.taskIssuer.value = task?.issuer || "";
  elements.taskDetail.value = task?.detail || "";
  elements.taskNote.value = task?.note || "";
  elements.taskDialog.showModal();
}

function saveTaskFromDialog() {
  const id = elements.editingTaskId.value;
  const existing = id ? findTask(id) : null;
  const values = {
    person: elements.taskPerson.value,
    required: true,
    category: elements.taskCategory.value,
    title: elements.taskTitle.value.trim(),
    issuer: elements.taskIssuer.value.trim(),
    detail: elements.taskDetail.value.trim(),
    note: elements.taskNote.value.trim(),
    updatedAt: new Date().toISOString(),
  };

  if (!values.title) {
    showToast("서류명을 입력하세요.");
    elements.taskTitle.focus();
    return;
  }

  if (existing) {
    Object.assign(existing, {
      ...values,
      status: existing.files.length ? "done" : "todo",
      due: existing.due || "",
    });
  } else {
    const targetPeople = values.person === "all" ? state.people : [values.person];
    targetPeople.forEach((person) => {
      state.tasks.push({
        id: makeId(),
        templateKey: "custom",
        category: values.category,
        order: 999,
        person,
        required: true,
        status: "todo",
        due: "",
        title: values.title,
        issuer: values.issuer,
        detail: values.detail,
        note: values.note,
        files: [],
        createdAt: new Date().toISOString(),
        updatedAt: values.updatedAt,
      });
    });
  }

  elements.taskDialog.close();
  render();
  showToast("저장했습니다.");
}

function deleteCurrentTask() {
  const id = elements.editingTaskId.value;
  if (!id) return;
  const task = findTask(id);
  if (!task) return;
  const confirmed = window.confirm(`'${task.title}' 항목을 삭제할까요?`);
  if (!confirmed) return;
  state.tasks = state.tasks.filter((item) => item.id !== id);
  elements.taskDialog.close();
  render();
  showToast("삭제했습니다.");
}

function resetState() {
  const confirmed = window.confirm("현재 저장된 상태와 메모를 지우고 기본 범용 서류 목록으로 복원할까요?");
  if (!confirmed) return;
  state = createDefaultState();
  setupSelects();
  render();
  showToast("기본 범용 서류 목록으로 복원했습니다.");
}

function exportState() {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "tax-document-tracker",
    version: 1,
    ...state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tax-documents-${state.settings.taxYear}-for-${state.settings.filingYear}-${state.settings.filingMonth.padStart(2, "0")}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importState(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!Array.isArray(parsed.tasks)) throw new Error("Invalid backup");
      state = {
        ...createDefaultState(),
        ...parsed,
        settings: normalizeCaseSettings(parsed.settings),
        people: Array.isArray(parsed.people) ? unique([...PEOPLE, ...parsed.people]) : PEOPLE,
        tasks: parsed.tasks.map(normalizeTask),
        filters: createDefaultState().filters,
      };
      state.tasks = mergeMissingTemplateTasks(state);
      setupSelects();
      render();
      showToast("백업을 불러왔습니다.");
    } catch {
      showToast("불러올 수 없는 JSON 파일입니다.");
    } finally {
      elements.importInput.value = "";
    }
  });
  reader.readAsText(file);
}

async function copySummary() {
  const summary = buildSummary();
  try {
    await navigator.clipboard.writeText(summary);
    showToast("요약을 복사했습니다.");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = summary;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast("요약을 복사했습니다.");
  }
}

function buildSummary() {
  const date = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const lines = [`${state.settings.title} 준비 현황 (${formatCaseLabel(state.settings)}, ${date})`, ""];
  state.people.forEach((person) => {
    const tasks = state.tasks.filter((task) => task.person === person && task.required);
    const activeTasks = tasks.filter((task) => task.status !== "na");
    const done = activeTasks.filter((task) => task.status === "done").length;
    lines.push(`[${person}] 완료 ${done}/${activeTasks.length}`);

    ["todo", "progress", "done", "na"].forEach((status) => {
      const matching = tasks.filter((task) => task.status === status);
      if (!matching.length) return;
      lines.push(`${STATUS[status]}: ${matching.map((task) => task.title).join(", ")}`);
    });
    lines.push("");
  });

  return lines.join("\n").trim();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 2200);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function initializeApp() {
  setupSelects();
  bindEvents();
  if (appRole) {
    updateRoleInUrl();
    await loadRemoteCase();
    if (appRole === "accountant") {
      state.mode = "requested";
      state.filters.person = "all";
    }
    if (appRole === "family" && (state.filters.person === "all" || !state.people.includes(state.filters.person))) {
      state.filters.person = state.people[0];
    }
  }
  render();
}

initializeApp();
