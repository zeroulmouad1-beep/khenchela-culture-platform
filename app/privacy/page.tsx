'use client'

import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'

const COPPER = '#c9952a'
const INDIGO_DEEP = '#1a0f0a'
const INDIGO_MEDIUM = '#1e1610'
const INDIGO_LIGHT = '#2a1e14'

export default function PrivacyPage() {
  const sections = [
    {
      title: 'المقدمة',
      content: 'مرحبًا بكم في منصة قطاع الثقافة والفنون لولاية خنشلة. نحن نلتزم بحماية خصوصيتكم وضمان أمان معلوماتكم الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية بياناتكم عند استخدام منصتنا الرقمية.',
    },
    {
      title: 'المعلومات التي نجمعها',
      content: 'قد نقوم بجمع المعلومات التالية عند استخدامكم للمنصة:\n• معلومات التعريف الشخصية (الاسم، البريد الإلكتروني، رقم الهاتف) عند التسجيل أو تقديم طلب خدمة.\n• معلومات تقنية مثل عنوان IP ونوع المتصفح ونظام التشغيل.\n• بيانات الاستخدام مثل الصفحات التي تمت زيارتها ومدة الجلسة.\n• أي معلومات أخرى تقدمونها طوعًا من خلال النماذج أو المراسلات.',
    },
    {
      title: 'كيفية استخدام المعلومات',
      content: 'نستخدم المعلومات المجمعة للأغراض التالية:\n• تقديم الخدمات الإلكترونية المتاحة عبر المنصة ومعالجة الطلبات.\n• تحسين تجربة المستخدم وتطوير المحتوى والخدمات.\n• التواصل معكم بشأن الفعاليات والأنشطة الثقافية.\n• ضمان أمن المنصة ومنع الاستخدام غير المصرح به.\n• الامتثال للمتطلبات القانونية والتنظيمية المعمول بها.',
    },
    {
      title: 'حماية البيانات',
      content: 'نتخذ التدابير الأمنية المناسبة لحماية معلوماتكم الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. تشمل هذه التدابير:\n• استخدام تقنيات التشفير لحماية نقل البيانات.\n• تقييد الوصول إلى المعلومات الشخصية على الموظفين المخولين فقط.\n• المراجعة الدورية لإجراءات جمع وتخزين ومعالجة البيانات.',
    },
    {
      title: 'مشاركة المعلومات',
      content: 'لا نقوم ببيع أو تأجير أو مشاركة معلوماتكم الشخصية مع أطراف ثالثة إلا في الحالات التالية:\n• عندما يكون ذلك ضروريًا لتقديم الخدمة المطلوبة.\n• عندما يقتضي القانون أو الأمر القضائي ذلك.\n• لحماية حقوق أو ممتلكات أو سلامة المنصة أو مستخدميها.',
    },
    {
      title: 'حقوق المستخدم',
      content: 'يحق لكم:\n• الاطلاع على بياناتكم الشخصية المخزنة لدينا.\n• طلب تصحيح أو تحديث معلوماتكم الشخصية.\n• طلب حذف بياناتكم الشخصية وفقًا للقوانين المعمول بها.\n• الاعتراض على معالجة بياناتكم لأغراض معينة.\n• تقديم شكوى إلى الجهة المختصة بحماية البيانات الشخصية.',
    },
    {
      title: 'ملفات تعريف الارتباط (Cookies)',
      content: 'قد تستخدم المنصة ملفات تعريف الارتباط لتحسين تجربة التصفح. يمكنكم التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحكم. علمًا أن تعطيل بعض ملفات تعريف الارتباط قد يؤثر على وظائف المنصة.',
    },
    {
      title: 'تعديل سياسة الخصوصية',
      content: 'نحتفظ بالحق في تعديل سياسة الخصوصية هذه في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة مع تحديث تاريخ آخر تعديل. ننصحكم بمراجعة هذه السياسة بشكل دوري.',
    },
    {
      title: 'التواصل معنا',
      content: 'إذا كانت لديكم أي استفسارات حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر:\n• البريد الإلكتروني: direction.culture40k@gmail.com\n• الهاتف: 032 71 23 45\n• العنوان: مديرية الثقافة والفنون، خنشلة، الجزائر',
    },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: INDIGO_DEEP }} dir="rtl">
      <div className="relative overflow-hidden py-20 px-4" style={{ background: `linear-gradient(135deg, ${INDIGO_DEEP} 0%, ${INDIGO_MEDIUM} 100%)` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201, 149, 42, 0.3) 0%, transparent 50%)' }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/?enter=true"
            className="inline-flex items-center gap-2 mb-8 text-sm transition-colors hover:text-white"
            style={{ color: '#a89070', fontFamily: 'Tajawal, sans-serif' }}
          >
            <ArrowRight size={16} />
            العودة للرئيسية
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${COPPER}20` }}>
              <Shield size={28} style={{ color: COPPER }} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Amiri, serif' }}>
                سياسة الخصوصية
              </h1>
              <p className="text-sm mt-1" style={{ color: '#a89070', fontFamily: 'Tajawal, sans-serif' }}>
                آخر تحديث: أبريل 2026
              </p>
            </div>
          </div>
          <p className="text-base leading-relaxed" style={{ color: '#d4c4a8', fontFamily: 'Tajawal, sans-serif' }}>
            منصة قطاع الثقافة والفنون - مديرية الثقافة والفنون لولاية خنشلة
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="rounded-xl border p-6 md:p-8"
              style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: `${COPPER}20`, color: COPPER, fontFamily: 'Tajawal, sans-serif' }}
                >
                  {index + 1}
                </div>
                <h2
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'Amiri, serif' }}
                >
                  {section.title}
                </h2>
              </div>
              <div
                className="text-base leading-loose whitespace-pre-line"
                style={{ color: '#d4c4a8', fontFamily: 'Tajawal, sans-serif', lineHeight: '2' }}
              >
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/?enter=true"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: COPPER, color: '#FFFFFF', fontFamily: 'Tajawal, sans-serif' }}
          >
            <ArrowRight size={16} />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
