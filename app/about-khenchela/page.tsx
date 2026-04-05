'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Home, Mountain, Landmark, Music, Droplets, Crown, Scroll } from 'lucide-react'

const COPPER = '#B87333'
const COPPER_LIGHT = '#D4956A'
const INDIGO_DEEP = '#0F172A'

const sections = [
  {
    icon: Crown,
    title: 'الجذور التاريخية',
    subtitle: 'ماسكولا القديمة وملحمة الكاهنة',
    paragraphs: [
      'تعود جذور خنشلة إلى مدينة "ماسكولا" (Mascula) الرومانية التي كانت من أبرز المراكز الحضرية في شمال إفريقيا القديمة. شهدت المدينة تعاقب حضارات عريقة من النوميديين والرومان والبيزنطيين، تاركةً إرثاً أثرياً غنياً لا يزال شاهداً على عظمة تلك الحقب.',
      'ارتبط اسم خنشلة ارتباطاً وثيقاً بالملكة الأمازيغية ديهيا (الكاهنة)، تلك المرأة الاستثنائية التي قادت المقاومة ضد الفتح الأموي في أواخر القرن السابع الميلادي. تُعدّ الكاهنة رمزاً للصمود والبطولة في ذاكرة الأوراس والجزائر بأسرها، وتُخلّد ذكراها في المعالم والتماثيل المنتشرة في ربوع الولاية.',
    ],
  },
  {
    icon: Music,
    title: 'الهوية الثقافية',
    subtitle: 'تراث الأوراس الأمازيغي الشاوي',
    paragraphs: [
      'تنبض خنشلة بروح الثقافة الأمازيغية الشاوية الأصيلة، حيث يحافظ سكانها على تقاليدهم العريقة في اللغة والفنون والعادات الاجتماعية. تُعدّ منطقة الأوراس حاضنة لهذا التراث الغني الذي يمتد لآلاف السنين.',
      'يتميز الفن الموسيقي الخنشلي بأنماط فريدة أبرزها موسيقى "العبادي" (Obadi) و"الرحابة" (Rahaba)، وهي أشكال تعبيرية أصيلة تمزج بين الشعر الشاوي والإيقاعات التقليدية في مناسبات الأفراح والاحتفالات الجماعية. كما تشتهر المنطقة بالصناعات الحرفية التقليدية من نسيج الزرابي (السجاد الأوراسي) وصناعة الفخار والحلي الفضية التي تعكس ذوقاً فنياً رفيعاً.',
    ],
  },
  {
    icon: Mountain,
    title: 'المعالم الطبيعية والثقافية',
    subtitle: 'قمة الشلية وحمّام الصالحين',
    paragraphs: [
      'تحتضن ولاية خنشلة جبل الشلية (Chelia) الذي يُعدّ أعلى قمة في شمال الجزائر بارتفاع يبلغ 2,328 متراً. يُشكّل هذا الجبل الشامخ جزءاً من سلسلة جبال الأوراس، ويتميز بغطائه الغابي الكثيف من أشجار الأرز الأطلسي النادرة وتساقط الثلوج الكثيفة شتاءً، مما يجعله وجهة سياحية فريدة.',
      'من أبرز معالم الولاية أيضاً حمّام الصالحين (Hammam Essalihine)، وهو حمّام روماني حراري يعود تاريخه إلى العهد الروماني. تتدفق مياهه المعدنية الساخنة عند درجة حرارة تصل إلى 70 درجة مئوية، وقد ظل مقصداً للاستشفاء منذ أكثر من ألفي عام. يُصنّف هذا الموقع ضمن المعالم الأثرية المحمية في الجزائر.',
    ],
  },
]

export default function AboutKhenchelaPage() {
  return (
    <div className="min-h-screen" dir="rtl" style={{ backgroundColor: INDIGO_DEEP }}>
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src="/images/khenchela-collage.jpg"
          alt="تراث وثقافة خنشلة"
          fill
          className="object-cover object-top"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.75) 50%, rgba(15,23,42,1) 100%)',
          }}
        />

        <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
          <Link
            href="/?enter=true"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: 'rgba(30,41,59,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(184,115,51,0.3)',
              color: COPPER_LIGHT,
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <ArrowRight size={16} />
            العودة للرئيسية
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: 'rgba(30,41,59,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(184,115,51,0.3)',
              color: COPPER_LIGHT,
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <Home size={16} />
            صفحة الترحيب
          </Link>
        </div>

        <div className="absolute bottom-16 right-0 left-0 px-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{
              backgroundColor: `${COPPER}20`,
              border: `1px solid ${COPPER}40`,
            }}
          >
            <Scroll size={14} style={{ color: COPPER_LIGHT }} />
            <span className="text-xs font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>
              ولاية خنشلة — الأوراس
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3"
            style={{ fontFamily: 'Tajawal, sans-serif' }}
          >
            خنشلة
          </h1>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto"
            style={{ color: COPPER_LIGHT, fontFamily: 'Amiri, serif' }}
          >
            أرض الأوراس الشامخة — حيث يلتقي عبق التاريخ بجمال الطبيعة وأصالة التراث
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 -mt-8 relative z-10">
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <section
                key={section.title}
                className="rounded-2xl p-6 sm:p-8 border"
                style={{
                  backgroundColor: 'rgba(30,41,59,0.7)',
                  backdropFilter: 'blur(16px)',
                  borderColor: `${COPPER}25`,
                  animation: `fadeInUp 0.6s ease-out ${0.2 + index * 0.15}s forwards`,
                  opacity: 0,
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${COPPER}20`, border: `1px solid ${COPPER}35` }}
                  >
                    <Icon size={22} style={{ color: COPPER_LIGHT }} />
                  </div>
                  <div>
                    <h2
                      className="text-xl sm:text-2xl font-bold text-white"
                      style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                      {section.title}
                    </h2>
                    <p className="text-sm" style={{ color: COPPER, fontFamily: 'Amiri, serif' }}>
                      {section.subtitle}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-sm sm:text-base leading-relaxed sm:leading-loose"
                      style={{ color: '#CBD5E1', fontFamily: 'Amiri, serif' }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Landmark, label: 'ماسكولا الرومانية', sub: 'أثر حضاري عريق' },
            { icon: Droplets, label: 'حمّام الصالحين', sub: 'حمّام روماني حراري' },
            { icon: Mountain, label: 'قمة الشلية', sub: '2,328 م — أعلى قمم الشمال' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="rounded-xl p-5 border text-center transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: 'rgba(30,41,59,0.6)',
                  backdropFilter: 'blur(12px)',
                  borderColor: `${COPPER}25`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${COPPER}15` }}
                >
                  <Icon size={24} style={{ color: COPPER_LIGHT }} />
                </div>
                <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {item.label}
                </p>
                <p className="text-xs" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>
                  {item.sub}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs" style={{ color: '#475569', fontFamily: 'Tajawal, sans-serif' }}>
            © {new Date().getFullYear()} منصة قطاع الثقافة والفنون — ولاية خنشلة
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
