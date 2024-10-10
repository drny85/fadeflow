// To parse this data:
//
//   import { Convert, Translation } from "./file";
//
//   const translation = Convert.toTranslation(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Translation {
    welcome:     string;
    tabs:        Tabs;
    login:       Login;
    profile:     Profile;
    days:        Days;
    longDays:    LongDays;
    months:      Months;
    booking:     Booking;
    service:     Service;
    reviews:     Reviews;
    button:      TranslationButton;
    schedule:    Schedule;
    appointment: TranslationAppointment;
    barber:      Barber;
    settings:    Settings;
    signup:      Signup;
    home:        Home;
    misc:        Misc;
    terms:       Privacy;
    privacy:     Privacy;
}

export interface TranslationAppointment {
    today:           string;
    new:             string;
    details:         Details;
    no_appointment:  string;
    available_today: string;
    toggle:          Toggle;
    status:          string;
    mark_completed:  string;
    filter:          Filter;
    broadcast:       Broadcast;
    confirmation:    AppointmentConfirmation;
}

export interface Broadcast {
    heading:     string;
    title:       string;
    message:     string;
    placeholder: string;
    button:      string;
}

export interface AppointmentConfirmation {
    cancel: Cancel;
}

export interface Cancel {
    title:   string;
    message: string;
    yes:     string;
}

export interface Details {
    main:  string;
    title: string;
}

export interface Filter {
    title:     string;
    Pending:   string;
    Confirmed: string;
    Cancelled: string;
    Completed: string;
    "No-show": string;
    button:    string;
    clear:     string;
}

export interface Toggle {
    upcoming: string;
    past:     string;
}

export interface Barber {
    search:       string;
    title:        string;
    rating:       string;
    distance:     string;
    no_barber:    string;
    review:       string;
    no_review:    string;
    about:        string;
    top_services: string;
    no_services:  string;
    schedule:     string;
    no_available: string;
    filter:       string;
    clear:        string;
    available:    string;
    info_options: InfoOptions;
}

export interface InfoOptions {
    info:     string;
    gallery:  string;
    reviews:  string;
    services: string;
    schedule: string;
}

export interface Booking {
    cash:                     string;
    select_service:           string;
    service_required:         string;
    service_required_message: string;
    payment:                  string;
    confirm:                  string;
    review:                   string;
    clients:                  string;
    search_clients:           string;
    name_required:            string;
    no_services:              string;
}

export interface TranslationButton {
    book:       string;
    cancel:     string;
    reschedule: string;
    continue:   string;
    update:     string;
    edit:       string;
    back:       string;
    save:       string;
}

export interface Days {
    Mon: string;
    Tue: string;
    Wed: string;
    Thu: string;
    Fri: string;
    Sat: string;
    Sun: string;
}

export interface Home {
    my_barber:    string;
    find_barber:  string;
    miles:        string;
    signup:       string;
    signup_title: string;
    rating:       string;
    estimated:    string;
    earned:       string;
    pending:      string;
    waiting:      Waiting;
    appointment:  HomeAppointment;
    greeting:     string;
}

export interface HomeAppointment {
    upcoming:       string;
    no_appointment: string;
    no_barber:      string;
}

export interface Waiting {
    completion:   string;
    confirmation: string;
    cashout:      string;
}

export interface Login {
    username: string;
    password: string;
    button:   string;
    no_login: string;
}

export interface LongDays {
    Monday:    string;
    Tuesday:   string;
    Wednesday: string;
    Thursday:  string;
    Friday:    string;
    Saturday:  string;
    Sunday:    string;
}

export interface Misc {
    of:                   string;
    trial_expired:        string;
    created_at:           string;
    subscribe:            string;
    remaining_days:       string;
    add_service:          string;
    must_subscribe:       string;
    free_trial:           string;
    no_data:              string;
    no_available:         string;
    no_available_message: string;
    no_services_added:    string;
}

export interface Months {
    January:   string;
    February:  string;
    March:     string;
    April:     string;
    May:       string;
    June:      string;
    July:      string;
    August:    string;
    September: string;
    October:   string;
    November:  string;
    December:  string;
}

export interface Privacy {
    section1: Section1;
    section2: Section1;
    section3: Section1;
    section4: Section1;
    section5: Section1;
    section6: Section1;
    section7: Section1;
    section8: Section1;
}

export interface Section1 {
    title:   string;
    message: string;
}

export interface Profile {
    theme:            string;
    preferences:      string;
    communication:    string;
    language:         string;
    contact:          string;
    logout:           string;
    name:             string;
    terms:            string;
    privacy:          string;
    susbcription:     string;
    minutes_interval: string;
    delete:           string;
    available:        string;
    update_profile:   string;
    confirmation:     ProfileConfirmation;
}

export interface ProfileConfirmation {
    delete: Cancel;
    logout: Cancel;
}

export interface Reviews {
    add:       string;
    no_review: string;
    title:     string;
    alert:     Section1;
}

export interface Schedule {
    name:      string;
    off:       string;
    break:     string;
    startTime: string;
    endTime:   string;
    message:   string;
    button:    ScheduleButton;
}

export interface ScheduleButton {
    review: string;
    update: string;
    close:  string;
}

export interface Service {
    title:       string;
    no_services: string;
    search:      string;
    details:     string;
    edit:        Edit;
}

export interface Edit {
    title:       string;
    update:      string;
    placeholder: string;
    add:         string;
    duration:    string;
    price:       string;
    description: string;
    image:       string;
    name:        string;
}

export interface Settings {
    title:    string;
    language: string;
    theme:    string;
    logout:   string;
}

export interface Signup {
    login:           string;
    signup:          string;
    title:           string;
    name:            string;
    phone:           string;
    email:           string;
    password:        string;
    confirmPassword: string;
    forgot:          string;
    placeholder:     Placeholder;
    complition:      Complition;
    button:          string;
    toggle:          string;
}

export interface Complition {
    name:    string;
    address: string;
    about:   string;
}

export interface Placeholder {
    name:            string;
    phone:           string;
    email:           string;
    password:        string;
    confirmPassword: string;
}

export interface Tabs {
    home:         string;
    appointments: string;
    barbers:      string;
    profile:      string;
    stuffs:       string;
    earnings:     string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTranslation(json: string): Translation {
        return cast(JSON.parse(json), r("Translation"));
    }

    public static translationToJson(value: Translation): string {
        return JSON.stringify(uncast(value, r("Translation")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Translation": o([
        { json: "welcome", js: "welcome", typ: "" },
        { json: "tabs", js: "tabs", typ: r("Tabs") },
        { json: "login", js: "login", typ: r("Login") },
        { json: "profile", js: "profile", typ: r("Profile") },
        { json: "days", js: "days", typ: r("Days") },
        { json: "longDays", js: "longDays", typ: r("LongDays") },
        { json: "months", js: "months", typ: r("Months") },
        { json: "booking", js: "booking", typ: r("Booking") },
        { json: "service", js: "service", typ: r("Service") },
        { json: "reviews", js: "reviews", typ: r("Reviews") },
        { json: "button", js: "button", typ: r("TranslationButton") },
        { json: "schedule", js: "schedule", typ: r("Schedule") },
        { json: "appointment", js: "appointment", typ: r("TranslationAppointment") },
        { json: "barber", js: "barber", typ: r("Barber") },
        { json: "settings", js: "settings", typ: r("Settings") },
        { json: "signup", js: "signup", typ: r("Signup") },
        { json: "home", js: "home", typ: r("Home") },
        { json: "misc", js: "misc", typ: r("Misc") },
        { json: "terms", js: "terms", typ: r("Privacy") },
        { json: "privacy", js: "privacy", typ: r("Privacy") },
    ], false),
    "TranslationAppointment": o([
        { json: "today", js: "today", typ: "" },
        { json: "new", js: "new", typ: "" },
        { json: "details", js: "details", typ: r("Details") },
        { json: "no_appointment", js: "no_appointment", typ: "" },
        { json: "available_today", js: "available_today", typ: "" },
        { json: "toggle", js: "toggle", typ: r("Toggle") },
        { json: "status", js: "status", typ: "" },
        { json: "mark_completed", js: "mark_completed", typ: "" },
        { json: "filter", js: "filter", typ: r("Filter") },
        { json: "broadcast", js: "broadcast", typ: r("Broadcast") },
        { json: "confirmation", js: "confirmation", typ: r("AppointmentConfirmation") },
    ], false),
    "Broadcast": o([
        { json: "heading", js: "heading", typ: "" },
        { json: "title", js: "title", typ: "" },
        { json: "message", js: "message", typ: "" },
        { json: "placeholder", js: "placeholder", typ: "" },
        { json: "button", js: "button", typ: "" },
    ], false),
    "AppointmentConfirmation": o([
        { json: "cancel", js: "cancel", typ: r("Cancel") },
    ], false),
    "Cancel": o([
        { json: "title", js: "title", typ: "" },
        { json: "message", js: "message", typ: "" },
        { json: "yes", js: "yes", typ: "" },
    ], false),
    "Details": o([
        { json: "main", js: "main", typ: "" },
        { json: "title", js: "title", typ: "" },
    ], false),
    "Filter": o([
        { json: "title", js: "title", typ: "" },
        { json: "Pending", js: "Pending", typ: "" },
        { json: "Confirmed", js: "Confirmed", typ: "" },
        { json: "Cancelled", js: "Cancelled", typ: "" },
        { json: "Completed", js: "Completed", typ: "" },
        { json: "No-show", js: "No-show", typ: "" },
        { json: "button", js: "button", typ: "" },
        { json: "clear", js: "clear", typ: "" },
    ], false),
    "Toggle": o([
        { json: "upcoming", js: "upcoming", typ: "" },
        { json: "past", js: "past", typ: "" },
    ], false),
    "Barber": o([
        { json: "search", js: "search", typ: "" },
        { json: "title", js: "title", typ: "" },
        { json: "rating", js: "rating", typ: "" },
        { json: "distance", js: "distance", typ: "" },
        { json: "no_barber", js: "no_barber", typ: "" },
        { json: "review", js: "review", typ: "" },
        { json: "no_review", js: "no_review", typ: "" },
        { json: "about", js: "about", typ: "" },
        { json: "top_services", js: "top_services", typ: "" },
        { json: "no_services", js: "no_services", typ: "" },
        { json: "schedule", js: "schedule", typ: "" },
        { json: "no_available", js: "no_available", typ: "" },
        { json: "filter", js: "filter", typ: "" },
        { json: "clear", js: "clear", typ: "" },
        { json: "available", js: "available", typ: "" },
        { json: "info_options", js: "info_options", typ: r("InfoOptions") },
    ], false),
    "InfoOptions": o([
        { json: "info", js: "info", typ: "" },
        { json: "gallery", js: "gallery", typ: "" },
        { json: "reviews", js: "reviews", typ: "" },
        { json: "services", js: "services", typ: "" },
        { json: "schedule", js: "schedule", typ: "" },
    ], false),
    "Booking": o([
        { json: "cash", js: "cash", typ: "" },
        { json: "select_service", js: "select_service", typ: "" },
        { json: "service_required", js: "service_required", typ: "" },
        { json: "service_required_message", js: "service_required_message", typ: "" },
        { json: "payment", js: "payment", typ: "" },
        { json: "confirm", js: "confirm", typ: "" },
        { json: "review", js: "review", typ: "" },
        { json: "clients", js: "clients", typ: "" },
        { json: "search_clients", js: "search_clients", typ: "" },
        { json: "name_required", js: "name_required", typ: "" },
        { json: "no_services", js: "no_services", typ: "" },
    ], false),
    "TranslationButton": o([
        { json: "book", js: "book", typ: "" },
        { json: "cancel", js: "cancel", typ: "" },
        { json: "reschedule", js: "reschedule", typ: "" },
        { json: "continue", js: "continue", typ: "" },
        { json: "update", js: "update", typ: "" },
        { json: "edit", js: "edit", typ: "" },
        { json: "back", js: "back", typ: "" },
        { json: "save", js: "save", typ: "" },
    ], false),
    "Days": o([
        { json: "Mon", js: "Mon", typ: "" },
        { json: "Tue", js: "Tue", typ: "" },
        { json: "Wed", js: "Wed", typ: "" },
        { json: "Thu", js: "Thu", typ: "" },
        { json: "Fri", js: "Fri", typ: "" },
        { json: "Sat", js: "Sat", typ: "" },
        { json: "Sun", js: "Sun", typ: "" },
    ], false),
    "Home": o([
        { json: "my_barber", js: "my_barber", typ: "" },
        { json: "find_barber", js: "find_barber", typ: "" },
        { json: "miles", js: "miles", typ: "" },
        { json: "signup", js: "signup", typ: "" },
        { json: "signup_title", js: "signup_title", typ: "" },
        { json: "rating", js: "rating", typ: "" },
        { json: "estimated", js: "estimated", typ: "" },
        { json: "earned", js: "earned", typ: "" },
        { json: "pending", js: "pending", typ: "" },
        { json: "waiting", js: "waiting", typ: r("Waiting") },
        { json: "appointment", js: "appointment", typ: r("HomeAppointment") },
        { json: "greeting", js: "greeting", typ: "" },
    ], false),
    "HomeAppointment": o([
        { json: "upcoming", js: "upcoming", typ: "" },
        { json: "no_appointment", js: "no_appointment", typ: "" },
        { json: "no_barber", js: "no_barber", typ: "" },
    ], false),
    "Waiting": o([
        { json: "completion", js: "completion", typ: "" },
        { json: "confirmation", js: "confirmation", typ: "" },
        { json: "cashout", js: "cashout", typ: "" },
    ], false),
    "Login": o([
        { json: "username", js: "username", typ: "" },
        { json: "password", js: "password", typ: "" },
        { json: "button", js: "button", typ: "" },
        { json: "no_login", js: "no_login", typ: "" },
    ], false),
    "LongDays": o([
        { json: "Monday", js: "Monday", typ: "" },
        { json: "Tuesday", js: "Tuesday", typ: "" },
        { json: "Wednesday", js: "Wednesday", typ: "" },
        { json: "Thursday", js: "Thursday", typ: "" },
        { json: "Friday", js: "Friday", typ: "" },
        { json: "Saturday", js: "Saturday", typ: "" },
        { json: "Sunday", js: "Sunday", typ: "" },
    ], false),
    "Misc": o([
        { json: "of", js: "of", typ: "" },
        { json: "trial_expired", js: "trial_expired", typ: "" },
        { json: "created_at", js: "created_at", typ: "" },
        { json: "subscribe", js: "subscribe", typ: "" },
        { json: "remaining_days", js: "remaining_days", typ: "" },
        { json: "add_service", js: "add_service", typ: "" },
        { json: "must_subscribe", js: "must_subscribe", typ: "" },
        { json: "free_trial", js: "free_trial", typ: "" },
        { json: "no_data", js: "no_data", typ: "" },
        { json: "no_available", js: "no_available", typ: "" },
        { json: "no_available_message", js: "no_available_message", typ: "" },
        { json: "no_services_added", js: "no_services_added", typ: "" },
    ], false),
    "Months": o([
        { json: "January", js: "January", typ: "" },
        { json: "February", js: "February", typ: "" },
        { json: "March", js: "March", typ: "" },
        { json: "April", js: "April", typ: "" },
        { json: "May", js: "May", typ: "" },
        { json: "June", js: "June", typ: "" },
        { json: "July", js: "July", typ: "" },
        { json: "August", js: "August", typ: "" },
        { json: "September", js: "September", typ: "" },
        { json: "October", js: "October", typ: "" },
        { json: "November", js: "November", typ: "" },
        { json: "December", js: "December", typ: "" },
    ], false),
    "Privacy": o([
        { json: "section1", js: "section1", typ: r("Section1") },
        { json: "section2", js: "section2", typ: r("Section1") },
        { json: "section3", js: "section3", typ: r("Section1") },
        { json: "section4", js: "section4", typ: r("Section1") },
        { json: "section5", js: "section5", typ: r("Section1") },
        { json: "section6", js: "section6", typ: r("Section1") },
        { json: "section7", js: "section7", typ: r("Section1") },
        { json: "section8", js: "section8", typ: r("Section1") },
    ], false),
    "Section1": o([
        { json: "title", js: "title", typ: "" },
        { json: "message", js: "message", typ: "" },
    ], false),
    "Profile": o([
        { json: "theme", js: "theme", typ: "" },
        { json: "preferences", js: "preferences", typ: "" },
        { json: "communication", js: "communication", typ: "" },
        { json: "language", js: "language", typ: "" },
        { json: "contact", js: "contact", typ: "" },
        { json: "logout", js: "logout", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "terms", js: "terms", typ: "" },
        { json: "privacy", js: "privacy", typ: "" },
        { json: "susbcription", js: "susbcription", typ: "" },
        { json: "minutes_interval", js: "minutes_interval", typ: "" },
        { json: "delete", js: "delete", typ: "" },
        { json: "available", js: "available", typ: "" },
        { json: "update_profile", js: "update_profile", typ: "" },
        { json: "confirmation", js: "confirmation", typ: r("ProfileConfirmation") },
    ], false),
    "ProfileConfirmation": o([
        { json: "delete", js: "delete", typ: r("Cancel") },
        { json: "logout", js: "logout", typ: r("Cancel") },
    ], false),
    "Reviews": o([
        { json: "add", js: "add", typ: "" },
        { json: "no_review", js: "no_review", typ: "" },
        { json: "title", js: "title", typ: "" },
        { json: "alert", js: "alert", typ: r("Section1") },
    ], false),
    "Schedule": o([
        { json: "name", js: "name", typ: "" },
        { json: "off", js: "off", typ: "" },
        { json: "break", js: "break", typ: "" },
        { json: "startTime", js: "startTime", typ: "" },
        { json: "endTime", js: "endTime", typ: "" },
        { json: "message", js: "message", typ: "" },
        { json: "button", js: "button", typ: r("ScheduleButton") },
    ], false),
    "ScheduleButton": o([
        { json: "review", js: "review", typ: "" },
        { json: "update", js: "update", typ: "" },
        { json: "close", js: "close", typ: "" },
    ], false),
    "Service": o([
        { json: "title", js: "title", typ: "" },
        { json: "no_services", js: "no_services", typ: "" },
        { json: "search", js: "search", typ: "" },
        { json: "details", js: "details", typ: "" },
        { json: "edit", js: "edit", typ: r("Edit") },
    ], false),
    "Edit": o([
        { json: "title", js: "title", typ: "" },
        { json: "update", js: "update", typ: "" },
        { json: "placeholder", js: "placeholder", typ: "" },
        { json: "add", js: "add", typ: "" },
        { json: "duration", js: "duration", typ: "" },
        { json: "price", js: "price", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "image", js: "image", typ: "" },
        { json: "name", js: "name", typ: "" },
    ], false),
    "Settings": o([
        { json: "title", js: "title", typ: "" },
        { json: "language", js: "language", typ: "" },
        { json: "theme", js: "theme", typ: "" },
        { json: "logout", js: "logout", typ: "" },
    ], false),
    "Signup": o([
        { json: "login", js: "login", typ: "" },
        { json: "signup", js: "signup", typ: "" },
        { json: "title", js: "title", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "phone", js: "phone", typ: "" },
        { json: "email", js: "email", typ: "" },
        { json: "password", js: "password", typ: "" },
        { json: "confirmPassword", js: "confirmPassword", typ: "" },
        { json: "forgot", js: "forgot", typ: "" },
        { json: "placeholder", js: "placeholder", typ: r("Placeholder") },
        { json: "complition", js: "complition", typ: r("Complition") },
        { json: "button", js: "button", typ: "" },
        { json: "toggle", js: "toggle", typ: "" },
    ], false),
    "Complition": o([
        { json: "name", js: "name", typ: "" },
        { json: "address", js: "address", typ: "" },
        { json: "about", js: "about", typ: "" },
    ], false),
    "Placeholder": o([
        { json: "name", js: "name", typ: "" },
        { json: "phone", js: "phone", typ: "" },
        { json: "email", js: "email", typ: "" },
        { json: "password", js: "password", typ: "" },
        { json: "confirmPassword", js: "confirmPassword", typ: "" },
    ], false),
    "Tabs": o([
        { json: "home", js: "home", typ: "" },
        { json: "appointments", js: "appointments", typ: "" },
        { json: "barbers", js: "barbers", typ: "" },
        { json: "profile", js: "profile", typ: "" },
        { json: "stuffs", js: "stuffs", typ: "" },
        { json: "earnings", js: "earnings", typ: "" },
    ], false),
};
