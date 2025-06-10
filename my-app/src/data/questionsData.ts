// src/data/questionsData.ts

export const questions = [
  {
    id: 1,
    story: "เมื่อรถไฟเคลื่อนขบวนออกจากชานชาลา คุณมองออกไปนอกหน้าต่างและเห็นแผนที่เส้นทางที่ซับซ้อน มันจุดประกายความคิดของคุณ...",
    question: "เมื่อเผชิญกับข้อมูลจำนวนมาก คุณรู้สึกอย่างไรเมื่อต้องจัดการกับมัน?",
    options: [
      { text: "A. ตื่นเต้นที่จะได้แยกแยะ จัดระเบียบ และค้นหารูปแบบที่ซ่อนอยู่", scores: { dataScientist: 3, developer: 1, uxui: 0, devops: 0, cybersecurity: 0, productManager: 1 } },
      { text: "B. ชอบที่จะสร้างแผนผังหรือแบบจำลองเพื่อทำความเข้าใจภาพรวม", scores: { uxui: 2, productManager: 3, developer: 1, dataScientist: 1, devops: 0, cybersecurity: 0 } },
      { text: "C. มองหาวิธีการที่รวดเร็วและมีประสิทธิภาพที่สุดในการประมวลผล", scores: { devops: 3, developer: 2, dataScientist: 1, uxui: 0, cybersecurity: 1, productManager: 0 } },
      { text: "D. ให้ความสำคัญกับการนำเสนอข้อมูลให้คนอื่นเข้าใจง่าย", scores: { uxui: 3, productManager: 2, dataScientist: 2, developer: 0, devops: 0, cybersecurity: 0 } }
    ]
  },
  {
    id: 2,
    story: "เสียงประกาศแจ้งเตือนถึงปัญหาระบบรางข้างหน้า... คุณคิดว่าจะเข้าไปช่วยแก้ไขสถานการณ์นี้อย่างไร?",
    question: "เมื่อระบบที่ซับซ้อนหยุดทำงาน คุณมักจะมีปฏิกิริยาอย่างไร?",
    options: [
      { text: "A. เจาะลึกโค้ดและหาบั๊กที่ทำให้เกิดปัญหา", scores: { developer: 3, devops: 2, cybersecurity: 1, dataScientist: 0, uxui: 0, productManager: 0 } },
      { text: "B. วิเคราะห์ภาพรวมของระบบเพื่อระบุจุดอ่อนด้านความปลอดภัย", scores: { cybersecurity: 3, devops: 1, developer: 1, dataScientist: 0, uxui: 0, productManager: 0 } },
      { text: "C. พยายามทำความเข้าใจประสบการณ์ของผู้โดยสารที่ได้รับผลกระทบ", scores: { uxui: 3, productManager: 2, developer: 0, dataScientist: 0, devops: 0, cybersecurity: 0 } },
      { text: "D. มองหาวิธีการอัตโนมัติเพื่อป้องกันปัญหาในอนาคต", scores: { devops: 3, developer: 1, cybersecurity: 1, dataScientist: 0, uxui: 0, productManager: 0 } }
    ]
  },
  {
    id: 3,
    story: "ผู้โดยสารแต่ละคนมีจุดหมายปลายทางและความต้องการที่แตกต่างกัน... คุณคิดว่าอะไรสำคัญที่สุดที่จะทำให้การเดินทางนี้ยอดเยี่ยมสำหรับทุกคน?",
    question: "ในการสร้างสรรค์สิ่งใหม่ คุณให้ความสำคัญกับอะไรมากที่สุด?",
    options: [
      { text: "A. ความถูกต้องแม่นยำทางเทคนิคและการทำงานได้อย่างสมบูรณ์แบบ", scores: { developer: 3, devops: 2, cybersecurity: 1, dataScientist: 1, uxui: 0, productManager: 0 } },
      { text: "B. การเข้าใจความต้องการและความรู้สึกของคนที่ใช้สิ่งนั้น", scores: { uxui: 3, productManager: 3, developer: 1, dataScientist: 1, devops: 0, cybersecurity: 0 } },
      { text: "C. ความสามารถในการขยายและปรับปรุงให้ดีขึ้นในอนาคต", scores: { devops: 2, developer: 2, productManager: 1, dataScientist: 0, uxui: 0, cybersecurity: 0 } },
      { text: "D. การวิเคราะห์ข้อมูลเพื่อตัดสินใจว่าอะไรคือสิ่งที่ดีที่สุด", scores: { dataScientist: 3, productManager: 2, developer: 1, uxui: 0, devops: 0, cybersecurity: 0 } }
    ]
  },
  {
    id: 4,
    story: "รถไฟกำลังจะวิ่งผ่านอุโมงค์ที่มืดมิดและไม่คุ้นเคย... คุณจะเตรียมการรับมือกับสิ่งที่ไม่คาดคิดอย่างไร?",
    question: "เมื่อต้องเผชิญกับภัยคุกคามที่ไม่คาดคิด คุณจะทำอย่างไร?",
    options: [
      { text: "A. ตรวจสอบอย่างละเอียดเพื่อหาช่องโหว่และป้องกัน", scores: { cybersecurity: 3, devops: 1, developer: 1, dataScientist: 0, uxui: 0, productManager: 0 } },
      { text: "B. วางแผนรับมือและเตรียมระบบให้พร้อมสำหรับสถานการณ์เลวร้าย", scores: { devops: 2, cybersecurity: 2, productManager: 1, developer: 0, dataScientist: 0, uxui: 0 } },
      { text: "C. สื่อสารและประสานงานกับทีมเพื่อหาทางออกร่วมกัน", scores: { productManager: 2, uxui: 1, developer: 1, dataScientist: 0, devops: 0, cybersecurity: 0 } },
      { text: "D. ค้นคว้าข้อมูลเพื่อทำความเข้าใจภัยคุกคามใหม่ๆ", scores: { cybersecurity: 2, dataScientist: 1, developer: 0, devops: 0, uxui: 0, productManager: 0 } }
    ]
  },
  {
    id: 5,
    story: "เมื่อมองดูทิวทัศน์ที่เคลื่อนผ่านไป คุณเห็นโอกาสในการสร้างเส้นทางใหม่ๆ... อะไรคือสิ่งที่คุณอยากสร้างมากที่สุด?",
    question: "คุณชอบที่จะสร้างสิ่งใดมากที่สุด?",
    options: [
      { text: "A. โปรแกรมหรือแอปพลิเคชันที่แก้ปัญหาในชีวิตจริง", scores: { developer: 3, devops: 1, productManager: 1, dataScientist: 0, uxui: 0, cybersecurity: 0 } },
      { text: "B. ประสบการณ์การใช้งานที่สวยงามและใช้งานง่าย", scores: { uxui: 3, productManager: 2, developer: 1, dataScientist: 0, devops: 0, cybersecurity: 0 } },
      { text: "C. ระบบที่ทำงานได้อย่างราบรื่นและมีประสิทธิภาพสูง", scores: { devops: 3, developer: 2, cybersecurity: 1, dataScientist: 0, uxui: 0, productManager: 0 } },
      { text: "D. โมเดลที่สามารถคาดการณ์อนาคตหรือค้นพบ insights ใหม่ๆ", scores: { dataScientist: 3, developer: 1, productManager: 1, uxui: 0, devops: 0, cybersecurity: 0 } }
    ]
  },
  {
    id: 6,
    story: "บนขบวนรถไฟแห่งนี้เต็มไปด้วยผู้คนจากหลากหลายสายงาน... คุณอยากจะร่วมทีมกับคนแบบไหนเพื่อไปให้ถึงจุดหมาย?",
    question: "คุณชอบที่จะทำงานกับทีมลักษณะไหน?",
    options: [
      { text: "A. ทีมที่เน้นการทำงานร่วมกันเพื่อสร้างผลิตภัณฑ์ที่ดีที่สุด", scores: { productManager: 3, developer: 2, uxui: 2, dataScientist: 1, devops: 1, cybersecurity: 1 } },
      { text: "B. ทีมที่เน้นการแก้ไขปัญหาและพัฒนาเทคโนโลยีใหม่ๆ", scores: { developer: 3, devops: 2, cybersecurity: 2, dataScientist: 1, uxui: 0, productManager: 0 } },
      { text: "C. ทีมที่เน้นการวิเคราะห์ข้อมูลและหาข้อสรุปที่ขับเคลื่อนด้วยข้อมูล", scores: { dataScientist: 3, productManager: 2, developer: 1, uxui: 1, devops: 0, cybersecurity: 0 } },
      { text: "D. ทีมที่เน้นการออกแบบและปรับปรุงประสบการณ์ของผู้ใช้", scores: { uxui: 3, productManager: 2, developer: 1, dataScientist: 0, devops: 0, cybersecurity: 0 } }
    ]
  },
  {
    id: 7,
    story: "เครื่องยนต์ของรถไฟต้องการการบำรุงรักษาอย่างต่อเนื่องเพื่อให้การเดินทางราบรื่น... คุณจะให้ความสำคัญกับอะไรเป็นพิเศษ?",
    question: "เมื่อเจอโปรเจกต์ที่ต้องดูแลต่อเนื่อง คุณจะให้ความสำคัญกับอะไร?",
    options: [
      { text: "A. การเขียนโค้ดที่สะอาดและดูแลรักษาง่าย", scores: { developer: 3, devops: 1, cybersecurity: 1, dataScientist: 1, uxui: 0, productManager: 0 } },
      { text: "B. การตรวจสอบความปลอดภัยและช่องโหว่อย่างสม่ำเสมอ", scores: { cybersecurity: 3, devops: 2, developer: 1, dataScientist: 0, uxui: 0, productManager: 0 } },
      { text: "C. การสร้างกระบวนการอัตโนมัติเพื่อให้งานมีประสิทธิภาพ", scores: { devops: 3, developer: 2, cybersecurity: 1, dataScientist: 0, uxui: 0, productManager: 0 } },
      { text: "D. การเก็บข้อมูลการใช้งานเพื่อปรับปรุงในอนาคต", scores: { productManager: 2, dataScientist: 2, uxui: 1, developer: 0, devops: 0, cybersecurity: 0 } }
    ]
  },
  {
    id: 8,
    story: "คุณเห็นทางแยกของรางรถไฟที่นำไปสู่เส้นทางที่ไม่เคยมีใครไปมาก่อน... คุณจะตัดสินใจเลือกเส้นทางนั้นอย่างไร?",
    question: "เมื่อต้องสำรวจเทคโนโลยีใหม่ๆ คุณรู้สึกอย่างไร?",
    options: [
      { text: "A. ตื่นเต้นที่จะได้ลองใช้และเข้าใจวิธีการทำงานภายใน", scores: { developer: 3, devops: 2, cybersecurity: 1, dataScientist: 1, uxui: 0, productManager: 0 } },
      { text: "B. ชอบที่จะเรียนรู้ว่ามันจะช่วยแก้ปัญหาให้กับผู้ใช้ได้อย่างไร", scores: { uxui: 2, productManager: 3, developer: 1, dataScientist: 0, devops: 0, cybersecurity: 0 } },
      { text: "C. มุ่งเน้นไปที่ประสิทธิภาพและความเสถียรของเทคโนโลยีนั้นๆ", scores: { devops: 3, cybersecurity: 2, developer: 1, dataScientist: 0, uxui: 0, productManager: 0 } },
      { text: "D. สนใจว่ามันสามารถให้ข้อมูลเชิงลึกอะไรได้บ้าง", scores: { dataScientist: 3, productManager: 1, developer: 1, uxui: 0, devops: 0, cybersecurity: 0 } }
    ]
  },
  {
    id: 9,
    story: "มีสัญญาณเตือนว่าอาจมีผู้บุกรุกเข้ามาในระบบควบคุมรถไฟ... คุณจะทำอย่างไรเพื่อรักษาความปลอดภัยของผู้โดยสารทุกคน?",
    question: "เมื่อพูดถึงความปลอดภัยของข้อมูล คุณให้ความสำคัญกับอะไรมากที่สุด?",
    options: [
      { text: "A. การป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต", scores: { cybersecurity: 3, devops: 1, developer: 1, dataScientist: 0, uxui: 0, productManager: 0 } },
      { text: "B. การรักษาความลับและความสมบูรณ์ของข้อมูล", scores: { cybersecurity: 3, dataScientist: 1, devops: 1, developer: 0, uxui: 0, productManager: 0 } },
      { text: "C. การสร้างระบบที่ป้องกันความผิดพลาดจากคน", scores: { devops: 2, developer: 1, cybersecurity: 1, dataScientist: 0, uxui: 0, productManager: 0 } },
      { text: "D. การให้ความรู้แก่ผู้ใช้เกี่ยวกับการรักษาความปลอดภัย", scores: { productManager: 2, uxui: 1, cybersecurity: 1, developer: 0, dataScientist: 0, devops: 0 } }
    ]
  },
  {
    id: 10,
    story: "ณ ปลายทาง คุณมองย้อนกลับไปบนเส้นทางที่ผ่านมาและวางแผนสำหรับการเดินทางครั้งต่อไป... คุณจะสรุปภาพรวมโครงการอย่างไร?",
    question: "เมื่อมองภาพรวมของโครงการ คุณมักจะคิดถึงสิ่งใดก่อน?",
    options: [
      { text: "A. ความสำเร็จของเป้าหมายทางธุรกิจและผลกระทบต่อผู้ใช้", scores: { productManager: 3, uxui: 2, dataScientist: 1, developer: 1, devops: 0, cybersecurity: 0 } },
      { text: "B. ความเป็นไปได้ทางเทคนิคและวิธีการพัฒนา", scores: { developer: 3, devops: 2, cybersecurity: 1, dataScientist: 1, uxui: 0, productManager: 0 } },
      { text: "C. ความสามารถในการปรับขนาดและดูแลรักษาระบบในระยะยาว", scores: { devops: 3, developer: 2, cybersecurity: 1, dataScientist: 0, uxui: 0, productManager: 0 } },
      { text: "D. วิธีการวัดผลความสำเร็จและนำข้อมูลมาใช้ปรับปรุง", scores: { dataScientist: 3, productManager: 2, developer: 1, uxui: 0, devops: 0, cybersecurity: 0 } }
    ]
  },
];

export const careerDescriptions = {
    developer: {
      name: "Software Developer/Engineer",
      description: "คุณคือผู้สร้างสรรค์ที่รักการแก้ปัญหาด้วยตรรกะและการเขียนโค้ด คุณสนุกกับการสร้างแอปพลิเคชัน เว็บไซต์ หรือระบบที่ใช้งานได้จริงและตอบโจทย์ผู้คน"
    },
    dataScientist: {
      name: "Data Scientist/Analyst",
      description: "คุณมีสายตาที่เฉียบคมในการมองหารูปแบบที่ซ่อนอยู่ในข้อมูล คุณชอบการวิเคราะห์ สถิติ และใช้ข้อมูลเพื่อหาคำตอบ คาดการณ์อนาคต และขับเคลื่อนการตัดสินใจทางธุรกิจ"
    },
    uxui: {
      name: "UX/UI Designer",
      description: "คุณใส่ใจและเข้าใจผู้ใช้เป็นอย่างดี คุณมีความสามารถในการออกแบบผลิตภัณฑ์ดิจิทัลให้สวยงามและใช้งานง่าย สร้างประสบการณ์ที่ดีที่สุดให้กับผู้ใช้งาน"
    },
    devops: {
      name: "DevOps Engineer",
      description: "คุณคือผู้ที่ทำให้ระบบทั้งหมดทำงานได้อย่างราบรื่นและมีประสิทธิภาพ คุณหลงใหลในการสร้างระบบอัตโนมัติ (Automation) เพื่อลดขั้นตอนและผสานการทำงานระหว่างทีมพัฒนาและทีมปฏิบัติการ"
    },
    cybersecurity: {
      name: "Cybersecurity Specialist",
      description: "คุณคือผู้พิทักษ์โลกดิจิทัล มีความรอบคอบและมองเห็นช่องโหว่ที่คนอื่นอาจมองข้าม คุณเชี่ยวชาญในการป้องกันระบบและข้อมูลจากการโจมตีทางไซเบอร์"
    },
    productManager: {
      name: "Product Manager (Tech)",
      description: "คุณมีวิสัยทัศน์ที่กว้างไกลในการกำหนดทิศทางของผลิตภัณฑ์ ทำหน้าที่เป็นสะพานเชื่อมระหว่างทีมธุรกิจ, ทีมเทคนิค และผู้ใช้ เพื่อสร้างผลิตภัณฑ์ที่ประสบความสำเร็จในตลาด"
    }
};