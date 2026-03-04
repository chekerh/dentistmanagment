#!/usr/bin/env python3
"""Apply i18n string replacements to all pages."""
import os

pages = "src/pages"

def edit(filename, pairs):
    path = os.path.join(pages, filename)
    with open(path) as f:
        c = f.read()
    for old, new in pairs:
        if old in c:
            c = c.replace(old, new, 1)
        else:
            print(f"  MISS [{filename}]: {repr(old[:70])}")
    with open(path, 'w') as f:
        f.write(c)
    print(f"  OK  {filename}")

# ─── LoginPage ───────────────────────────────────────────────────────────────
edit("LoginPage.tsx", [
    ("Staff Portal Login",                              "{t.login.title}"),
    ("Welcome back. Please enter your details.",        "{t.login.subtitle}"),
    (">Username or ID<",                                ">{t.login.usernameLabel}<"),
    ('placeholder="Enter your staff ID"',               "placeholder={t.login.usernamePlaceholder}"),
    (">Password<",                                      ">{t.login.passwordLabel}<"),
    ('placeholder="Enter your password"',               "placeholder={t.login.passwordPlaceholder}"),
    (">Remember me<",                                   ">{t.login.rememberMe}<"),
    (">Forgot password?<",                              ">{t.login.forgotPassword}<"),
    (">Log In<",                                        ">{t.login.signIn}<"),
    ("Signing in\u2026",                                "{t.login.signingIn}"),
    ("Invalid credentials. Try admin/admin or patient/patient", "{t.login.invalidCredentials}"),
    (">Demo Credentials<",                              ">{t.login.demoTitle}<"),
    (">Admin<",                                         ">{t.login.demoAdminLabel}<"),
    (">Patient<",                                       ">{t.login.demoPatientLabel}<"),
    ("Need access? Contact the",                        "{t.login.needAccess}"),
    ("Clinic Administrator",                            "{t.login.clinicAdmin}"),
    ("Powered by DentalCare Systems",                   "{t.login.poweredBy}"),
])

# ─── DashboardPage ───────────────────────────────────────────────────────────
edit("DashboardPage.tsx", [
    ("Today\u2019s Appointments",   "{t.dashboard.todayAppts}"),
    ("New Patients",                "{t.dashboard.newPatients}"),
    ("Pending Labs",                "{t.dashboard.pendingLabs}"),
    ("Inventory Alerts",            "{t.dashboard.inventoryAlerts}"),
    ("Processing",                  "{t.dashboard.processing}"),
    (">Low Stock<",                 ">{t.dashboard.lowStock}<"),
    ("Today\u2019s Schedule",       "{t.dashboard.todaySchedule}"),
    ("View Calendar",               "{t.dashboard.viewCalendar}"),
    ("No appointments today",       "{t.dashboard.noAppointmentsToday}"),
    ("Quick Actions",               "{t.dashboard.quickActions}"),
    ("Add Stock",                   "{t.dashboard.addStock}"),
    ("New Bill",                    "{t.dashboard.newBill}"),
    ("View all alerts \u2192",      "{t.dashboard.viewAllAlerts}"),
    ("Recent Patients",             "{t.dashboard.recentPatients}"),
    ("View Patient",                "{t.dashboard.viewPatient}"),
    # Table headers & modal fields are in JSX text
    (">Last Visit<",                ">{t.dashboard.tableLastVisit}<"),
    (">Next Appointment<",          ">{t.dashboard.tableNextAppt}<"),
    (">Appointment Details<",       ">{t.dashboard.apptDetails}<"),
])

# ─── PatientsPage ────────────────────────────────────────────────────────────
edit("PatientsPage.tsx", [
    (">Add Patient<",               ">{t.patients.addPatient}<"),
    ('placeholder="Search patients by name, email, phone, or ID\u2026"',
     "placeholder={t.patients.searchPlaceholder}"),
    ("Total Patients",              "{t.patients.totalPatients}"),
    ("With Balance Due",            "{t.patients.withBalance}"),
    ("New This Month",              "{t.patients.newThisMonth}"),
    (">Age / Gender<",              ">{t.patients.tableAgeGender}<"),
    (">Contact<",                   ">{t.patients.tableContact}<"),
    (">Last Visit<",                ">{t.patients.tableLastVisit}<"),
    ("No patients found",           "{t.patients.noPatientsFound}"),
    ("Add New Patient",             "{t.patients.modalTitle}"),
    (">First Name<",                ">{t.patients.fieldFirstName}<"),
    (">Last Name<",                 ">{t.patients.fieldLastName}<"),
    (">Email<",                     ">{t.patients.fieldEmail}<"),
    (">Phone<",                     ">{t.patients.fieldPhone}<"),
    (">Date of Birth<",             ">{t.patients.fieldDob}<"),
    (">Blood Type<",                ">{t.patients.fieldBloodType}<"),
    (">Insurance Provider<",        ">{t.patients.fieldInsProvider}<"),
    (">Insurance Number<",          ">{t.patients.fieldInsNumber}<"),
    (">Gender<",                    ">{t.patients.fieldGender}<"),
    (">Address<",                   ">{t.patients.fieldAddress}<"),
    (">Allergies<",                 ">{t.patients.fieldAllergies}<"),
    (">Medical History<",           ">{t.patients.fieldMedHistory}<"),
    ("Patient added! (Demo \u2013 data not persisted)", "{t.patients.addedDemo}"),
])

# ─── PatientDetailPage ───────────────────────────────────────────────────────
edit("PatientDetailPage.tsx", [
    (">Book Appointment<",          ">{t.patientDetail.bookAppointment}<"),
    (">Patients<",                  ">{t.patientDetail.patientsLink}<"),
    ("Personal Information",        "{t.patientDetail.personalInfo}"),
    (">Date of Birth<",             ">{t.patientDetail.fieldDob}<"),
    (">Blood Type<",                ">{t.patientDetail.fieldBloodType}<"),
    (">Insurance<",                 ">{t.patientDetail.fieldInsurance}<"),
    (">Insurance No.<",             ">{t.patientDetail.fieldInsuranceNo}<"),
    (">Registered<",                ">{t.patientDetail.fieldRegistered}<"),
    (">Allergies<",                 ">{t.patientDetail.allergies}<"),
    ("No known allergies",          "{t.patientDetail.noAllergies}"),
    ("Medical History",             "{t.patientDetail.medicalHistory}"),
    ("No medical history on record.", "{t.patientDetail.noMedHistory}"),
    (">Appointments<",              ">{t.patientDetail.appointmentsSection}<"),
    (">View all<",                  ">{t.patientDetail.viewAll}<"),
    ("No appointments",             "{t.patientDetail.noAppointments}"),
    ("Treatment History",           "{t.patientDetail.treatmentHistory}"),
    ("No treatment records",        "{t.patientDetail.noTreatments}"),
    ("Payment History",             "{t.patientDetail.paymentHistory}"),
    ("No payments",                 "{t.patientDetail.noPayments}"),
    ("Balance Due",                 "{t.patientDetail.balanceDue}"),
    ("Back to patients",            "{t.patientDetail.backToPatients}"),
    ("Paid:",                       "{t.patientDetail.paidLabel}"),
])

# ─── AppointmentsPage ────────────────────────────────────────────────────────
edit("AppointmentsPage.tsx", [
    (">Schedule<",                  ">{t.appointments.scheduleBtn}<"),
    ('placeholder="Search by patient name or treatment\u2026"',
     "placeholder={t.appointments.searchPlaceholder}"),
    ("No appointments found",       "{t.appointments.noFound}"),
    (">View Session<",              ">{t.appointments.viewSession}<"),
    (">Quick View<",                ">{t.appointments.quickView}<"),
    (">View Patient<",              ">{t.appointments.viewPatient}<"),
    (">Billing<",                   ">{t.appointments.billing}<"),
    ("Schedule Appointment",        "{t.appointments.modalTitle}"),
    (">Select patient\u2026<",      ">{t.appointments.selectPatient}<"),
    (">Treatment Type<",            ">{t.appointments.fieldTreatment}<"),
    ("Duration (min)",              "{t.appointments.fieldDuration}"),
    ("Fee ($)",                     "{t.appointments.fieldFee}"),
    ("Book Appointment",            "{t.appointments.bookBtn}"),
    ("Appointment booked! (Demo)",  "{t.appointments.bookedDemo}"),
    ("Appointment Details",         "{t.appointments.detailsTitle}"),
    (">View Patient<",              ">{t.appointments.viewPatientBtn}<"),
    ("Process Payment",             "{t.appointments.processPayment}"),
])

# ─── AppointmentSessionPage ──────────────────────────────────────────────────
edit("AppointmentSessionPage.tsx", [
    (">Back<",                      ">{t.session.backBtn}<"),
    (">Save Session<",              ">{t.session.saveSession}<"),
    (">Appointments<",              ">{t.session.appointmentsLink}<"),
    ("Treatment:",                  "{t.session.treatmentLabel}"),
    ("Room:",                       "{t.session.roomLabel}"),
    ("Allergies:",                  "{t.session.allergiesLabel}"),
    (">History<",                   ">{t.session.historyBtn}<"),
    (">Contact<",                   ">{t.session.contactBtn}<"),
    ("Session Status",              "{t.session.sessionStatusLabel}"),
    ("Clinical Notes",              "{t.session.clinicalNotes}"),
    ("Saved",                       "{t.session.savedLabel}"),
    ("Unsaved changes",             "{t.session.unsavedLabel}"),
    ("Save Notes",                  "{t.session.saveNotesBtn}"),
    ("Materials Used",              "{t.session.materialsUsed}"),
    ("Total Items",                 "{t.session.totalItems}"),
    ('placeholder="Item name"',     "placeholder={t.session.itemNamePh}"),
    ('placeholder="Unit / description"', "placeholder={t.session.itemUnitPh}"),
    ("Next Appointment",            "{t.session.nextAppt}"),
    ("Dr. recommends a follow-up visit in", "{t.session.followUpDesc}"),
    ("2 weeks",                     "{t.session.twoWeeks}"),
    ("for check-up.",               "{t.session.forCheckup}"),
    ("Schedule Follow-up",          "{t.session.scheduleFollowUp}"),
    ("Print Prescription",          "{t.session.printPrescription}"),
    ("Session Summary",             "{t.session.sessionSummary}"),
    ("Appointment not found.",      "{t.session.notFound}"),
    ("\u2190 Back to Appointments", "{t.session.backToAppts}"),
])

# ─── InventoryPage ────────────────────────────────────────────────────────────
edit("InventoryPage.tsx", [
    (">Add Item<",                  ">{t.inventory.addItem}<"),
    ('placeholder="Search by name, SKU, or supplier\u2026"',
     "placeholder={t.inventory.searchPlaceholder}"),
    ("Total Items",                 "{t.inventory.statTotalItems}"),
    ("Expiring Soon",               "{t.inventory.statExpiring}"),
    ("Total Value",                 "{t.inventory.statTotalValue}"),
    ("No items found",              "{t.inventory.noFound}"),
    ("Item Details",                "{t.inventory.detailTitle}"),
    ("Last Restocked",              "{t.inventory.detailLastRestocked}"),
    ("Expiration",                  "{t.inventory.detailExpiry}"),
    (">Location<",                  ">{t.inventory.detailLocation}<"),
    ("Stock is at or below reorder threshold. Please reorder soon.", "{t.inventory.lowStockWarning}"),
    (">Reorder Stock<",             ">{t.inventory.reorderStock}<"),
    ("Reorder placed! (Demo)",      "{t.inventory.reorderDemo}"),
    ("Add Inventory Item",          "{t.inventory.addTitle}"),
    (">Item Name<",                 ">{t.inventory.fieldName}<"),
    (">SKU<",                       ">{t.inventory.fieldSku}<"),
    (">Unit<",                      ">{t.inventory.fieldUnit}<"),
    (">Supplier<",                  ">{t.inventory.fieldSupplier}<"),
    (">Expiration Date<",           ">{t.inventory.fieldExpiry}<"),
    ("Reorder Threshold",           "{t.inventory.fieldReorderThreshold}"),
    (">Description<",               ">{t.inventory.fieldDescription}<"),
    ("Item added! (Demo)",          "{t.inventory.addedDemo}"),
])

# ─── BillingPage ──────────────────────────────────────────────────────────────
edit("BillingPage.tsx", [
    (">New Invoice<",               ">{t.billing.newInvoice}<"),
    ("Total Collected",             "{t.billing.totalCollected}"),
    ("Outstanding Balance",         "{t.billing.outstanding}"),
    (">Overdue<",                   ">{t.billing.overdue}<"),
    ('placeholder="Search by patient or description\u2026"',
     "placeholder={t.billing.searchPlaceholder}"),
    ("No records found",            "{t.billing.noFound}"),
    (">Pay<",                       ">{t.billing.payBtn}<"),
    ("Payment processed! (Demo)",   "{t.billing.processedDemo}"),
    ("New Invoice / Payment",       "{t.billing.invoiceTitle}"),
    (">Select patient\u2026<",      ">{t.billing.selectPatient}<"),
    ('placeholder="e.g. Dental cleaning & X-ray"',
     "placeholder={t.billing.fieldDescPlaceholder}"),
    (">Amount ($)<",                ">{t.billing.fieldAmount}<"),
    ("Payment Method",              "{t.billing.fieldMethod}"),
    (">Insurance Claim #<",         ">{t.billing.fieldInsurance}<"),
    ('placeholder="INS-2026-XXXX"', "placeholder={t.billing.fieldInsPlaceholder}"),
    (">Process Payment<",           ">{t.billing.processBtn}<"),
    ("Payment Details",             "{t.billing.detailTitle}"),
    ("Total Amount",                "{t.billing.detailTotal}"),
    ("Insurance Claim",             "{t.billing.detailInsurance}"),
    ("Mark as Paid",                "{t.billing.markAsPaid}"),
])

# ─── ReportsPage ─────────────────────────────────────────────────────────────
edit("ReportsPage.tsx", [
    (">Financial Report<",          ">{t.reports.financialReportBtn}<"),
    (">Export<",                    ">{t.reports.exportBtn}<"),
    ("Total Revenue (6mo)",         "{t.reports.statRevenue}"),
    ("Net Profit (6mo)",            "{t.reports.statProfit}"),
    ("Total Patients (6mo)",        "{t.reports.statPatients}"),
    ("Overdue Payments",            "{t.reports.statOverdue}"),
    ("Revenue vs Expenses (Last 7 months)", "{t.reports.chartRevExp}"),
    ("Patient Volume per Month",    "{t.reports.chartPatients}"),
    ("Treatment Distribution",      "{t.reports.chartTreatments}"),
    ("Recent Payments",             "{t.reports.recentPayments}"),
])

# ─── FinancialReportPage ─────────────────────────────────────────────────────
edit("FinancialReportPage.tsx", [
    (">Financial Report<",          ">{t.financialReport.title}<"),
    ("March 2026 \u2022 Detailed revenue breakdown", "{t.financialReport.subtitle}"),
    (">This Month<",                ">{t.financialReport.thisMonth}<"),
    (">Reports<",                   ">{t.financialReport.reportsBtn}<"),
    (">Export PDF<",                ">{t.financialReport.exportPdf}<"),
    ("Total Revenue",               "{t.financialReport.cardRevenue}"),
    ("Pending Payments",            "{t.financialReport.cardPending}"),
    ("vs last month",               "{t.financialReport.vsLastMonth}"),
    ("invoices pending",            "{t.financialReport.invoicesPending}"),
    ("Requires immediate attention", "{t.financialReport.requiresAttention}"),
    ("Revenue by Category",         "{t.financialReport.revByCategory}"),
    ("Payment Status",              "{t.financialReport.paymentStatus}"),
    ("Most pending payments are from insurance claims processing.", "{t.financialReport.insuranceNote}"),
    ("Recent Transactions",         "{t.financialReport.recentTransactions}"),
    (">All Statuses<",              ">{t.financialReport.allStatuses}<"),
    ("No transactions match this filter", "{t.financialReport.noTransactions}"),
    ("transaction(s)",              "{t.financialReport.transactionCount}"),
    ("View All Billing",            "{t.financialReport.viewAllBilling}"),
    ("Orthodontics",                "{t.financialReport.catOrtho}"),
    ("Implants",                    "{t.financialReport.catImplants}"),
    (">General<",                   ">{t.financialReport.catGeneral}<"),
    ("Cosmetic",                    "{t.financialReport.catCosmetic}"),
    ("Hygiene",                     "{t.financialReport.catHygiene}"),
    (">Receipt<",                   ">{t.financialReport.receipt}<"),
    ("Resend Invoice",              "{t.financialReport.resendInvoice}"),
    ("Issue Invoice",               "{t.financialReport.issueInvoice}"),
])

# ─── NotificationsPage ───────────────────────────────────────────────────────
edit("NotificationsPage.tsx", [
    ("Mark all as read",            "{t.notifications.markAllRead}"),
    ("No notifications",            "{t.notifications.noNotifications}"),
    ("No unread notifications",     "{t.notifications.noUnreadNotifications}"),
    ("priority",                    "{t.notifications.prioritySuffix}"),
    ("Notification Settings",       "{t.notifications.settingsTitle}"),
    ("Appointment reminders",       "{t.notifications.apptReminders}"),
    ("Get notified 30 min before appointments", "{t.notifications.apptRemindersDesc}"),
    ("Low stock alerts",            "{t.notifications.lowStockAlerts}"),
    ("Alert when inventory falls below threshold", "{t.notifications.lowStockDesc}"),
    ("Payment reminders",           "{t.notifications.paymentReminders}"),
    ("Notify patients of overdue payments", "{t.notifications.paymentRemindersDesc}"),
    ("System updates",              "{t.notifications.systemUpdates}"),
    ("Receive system maintenance notices", "{t.notifications.systemUpdatesDesc}"),
])

# ─── SettingsPage ─────────────────────────────────────────────────────────────
edit("SettingsPage.tsx", [
    ("Settings saved successfully!", "{t.settings.savedSuccess}"),
    ("Change Photo",                "{t.settings.changePhoto}"),
    (">Full Name<",                 ">{t.settings.fieldFullName}<"),
    (">Email<",                     ">{t.settings.fieldEmail}<"),
    (">Phone<",                     ">{t.settings.fieldPhone}<"),
    (">Specialty<",                 ">{t.settings.fieldSpecialty}<"),
    (">License Number<",            ">{t.settings.fieldLicense}<"),
    ("Save Changes",                "{t.settings.saveChanges}"),
    ("Clinic Information",          "{t.settings.clinicInfo}"),
    (">Clinic Name<",               ">{t.settings.fieldClinicName}<"),
    (">Website<",                   ">{t.settings.fieldWebsite}<"),
    (">Opening Time<",              ">{t.settings.fieldOpenTime}<"),
    (">Closing Time<",              ">{t.settings.fieldCloseTime}<"),
    ("Save Clinic Info",            "{t.settings.saveClinic}"),
    ("Security Settings",           "{t.settings.securityTitle}"),
    (">Current Password<",          ">{t.settings.currentPassword}<"),
    (">New Password<",              ">{t.settings.newPassword}<"),
    (">Confirm New Password<",      ">{t.settings.confirmPassword}<"),
    ("Update Password",             "{t.settings.updatePassword}"),
    ("Two-Factor Authentication",   "{t.settings.twoFactor}"),
    ("Authenticator App",           "{t.settings.authenticatorApp}"),
    ("Not configured",              "{t.settings.notConfigured}"),
    (">Set up<",                    ">{t.settings.setUp}<"),
    ("Notification Preferences",    "{t.settings.notifPrefs}"),
    ("Email Notifications",         "{t.settings.emailNotifs}"),
    ("Receive notifications via email", "{t.settings.emailNotifsDesc}"),
    ("Appointment Reminders",       "{t.settings.apptReminders}"),
    ("Reminders 24h and 1h before appointments", "{t.settings.apptRemindersDesc}"),
    ("Low Stock Alerts",            "{t.settings.lowStockAlerts}"),
    ("Notify when inventory items fall below threshold", "{t.settings.lowStockDesc}"),
    ("Payment Reminders",           "{t.settings.paymentReminders}"),
    ("Auto-send payment reminders to patients", "{t.settings.paymentRemindersDesc}"),
    ("System Announcements",        "{t.settings.sysAnnouncements}"),
    ("Receive product updates and news", "{t.settings.sysAnnouncementsDesc}"),
])

# ─── PatientPortalPage ────────────────────────────────────────────────────────
edit("PatientPortalPage.tsx", [
    ("DentalCare Patient Portal",   "{t.portal.headerTitle}"),
    (">Book Appointment<",          ">{t.portal.bookAppointment}<"),
    ("Welcome back,",               "{t.portal.welcomeBack}"),
    ("Patient ID:",                 "{t.portal.patientIdLabel}"),
    ("Next Appointment",            "{t.portal.nextAppointmentLabel}"),
    ("None scheduled",              "{t.portal.noneScheduled}"),
    ("Total Visits",                "{t.portal.statVisits}"),
    (">Upcoming<",                  ">{t.portal.statUpcoming}<"),
    (">Treatments<",                ">{t.portal.statTreatments}<"),
    ("Balance Due",                 "{t.portal.statBalance}"),
    ("Upcoming Appointments",       "{t.portal.upcomingAppts}"),
    (">View all<",                  ">{t.portal.viewAll}<"),
    ("No upcoming appointments",    "{t.portal.noUpcomingAppts}"),
    ("+ Book an appointment",       "{t.portal.bookAnAppt}"),
    ("My Information",              "{t.portal.myInfo}"),
    ("Known Allergies",             "{t.portal.knownAllergies}"),
    ("My Appointments",             "{t.portal.myAppointments}"),
    (">Book New<",                  ">{t.portal.bookNew}<"),
    ("No treatment records",        "{t.portal.noTreatments}"),
    ("Request Appointment",         "{t.portal.requestAppt}"),
    (">Preferred Date<",            ">{t.portal.prefDate}<"),
    (">Preferred Time<",            ">{t.portal.prefTime}<"),
    ("Reason for Visit",            "{t.portal.reasonForVisit}"),
    ("Additional Notes",            "{t.portal.additionalNotes}"),
    ('placeholder="Any concerns you\'d like to mention\u2026"',
     "placeholder={t.portal.notesPh}"),
    ("Appointment request sent! The clinic will confirm shortly. (Demo)", "{t.portal.requestedDemo}"),
    ("Paid:",                       "{t.portal.paidLabel}"),
    ("Claim:",                      "{t.portal.claimLabel}"),
])

print("\nAll pages updated!")
