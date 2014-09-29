﻿define(
	 ({
		builder: {
			layouts: {
				mainStage: "เวทีหลัก",
				sideTitle: "แถบเลื่อน",
				sideDescr: "รูปแบบสำหรับตัวอักษรเยอะๆสำหรับเรื่องราว ซึ่ง excels ได้รวมรูปของคุณ วิดีโอ และแผนที่ในรูปแบบข้อความที่ชัดเจน",
				floatTitle: "หน้าต่างลอยๆ",
				floatDescr: "โครงร่างที่ช่วยจัดวางข้อมูลแผนที่ให้น่าสนใจ ในขณะที่สามารถปรับแต่งข้อความในแผงข้อมูลให้บอกเล่าเรื่องราวได้ดียิ่งขึ้น"
			},
			common: {
				lblStatus1: "ตีพิมพ์",
				lblStatus2: "ดราฟ",
				lblStatus3: "ซ่อน"
			},
			settingsLayoutOptions: {
				title: "เงื่อนไขรูปแบบ",
				cfgLeft: "ซ้าย",
				cfgRight: "ขวา",
				cfgSmall: "เล็ก",
				cfgMedium: "กลาง",
				cfgLarge: "ใหญ่",
				socialLinksLabel: "การเชื่อมโยงที่แสดงร่วมกันที่ด้านล่างของแต่ละส่วน",
				socialLinksDescr: "This enables readers to reference and promote specific sections of your %TPL_NAME%. For instance, if you use a sections share icon, readers will land at that specific %TPL_NAME% section rather than the beginning of your story. Your readers can use the social media link in the title section to promote your entire %TPL_NAME% (header tab) and have them land at the start of the %TPL_NAME%."
			},
			settingsLayoutFonts: {
				title: "ประเภทตัวอักษร",
				defaultLbl: "Default",
				sectionTitleLbl: "Section title",
				sectionContentLbl: "Section content"
			},
			initPopup: {
				title: "ยินดีต้อนรับสู่"
			},
			addEditPopup: {
				disabled: "ไม่สามารถเพิ่มส่วนของข้อมูลได้ เนื่องจากข้อมูลมีจำนวนเกินกว่าจำนวนที่มากที่สุดที่กำหนด",
				titleAdd: "เพิ่มส่วน",
				titleAddHome: "เพิ่มส่วนหน้าหลัก",
				titleEdit: "แก้ไขส่วน",
				step: "ขั้นตอน",
				stepMainStageExplain: "เนื้อหาหลัก",
				stepPanelExplain: "เนื้อหา",
				stepMainStageNextTooltip: "เพิ่มหัวส่วนและเลือกรายการเวทีหลัก",
				stepMainStageNextTooltip2: "เลือกเนื้อหาหลัก",
				step2NextTooltip: "เพิ่มหัวข้อส่วนและ%LAYOUT-TYPE% รายการ",
				stepNextTooltipNext: "ไปยังขั้นตอนต่อไป",
				stepNextTooltipAdd: "เพิ่มส่วน",
				firstAddExplain: "ส่วนแรกคือส่วนหน้าหลักของคุณ ซึ่งเปรียบเสมือนหน้าปกของคุณ ชื่อเรื่องที่คุณกำหนดขึ้นจะแสดงด้วยตัวอักษรขนาดใหญ่",
				firstAddLeanMore: "เรียนรู้เพิ่มเติม",
				titlePlaceholder: "หัวข้อส่วน..."
			},
			addEditViewText: {
				editorPlaceholder: "เพิ่มตัวอีกษร ลิ้ง และกราฟเล็กๆที่นี่",
				editorActionsTitle: "ดำเนินการเวทีหลัก",
				editorActionsHelpDescr: "ใช้ตัวควบคุมเหล่านี้เพื่อสร้างการเชื่อมโยงที่จะเปลี่ยนเวทีหลัก ตัวอย่างเช่นเมื่อผู้อ่านคลิกลิงก์ที่คุณอาจต้องการที่จะซูมแผนที่ไปยังตำแหน่งที่เฉพาะเจาะจงแสดงแผนที่เว็บอื่นหรือแสดงภาพ",
				mainStageDisabled: "ขั้นตอนการดำเนินการหลักคือการปิดใช้งานเมื่อมีผู้แก้ไขเกินจำนวน"
			},
			organizePopup: {
				title: "องค์กร",
				lblHeader: "เลือกและวางข้อมูลบางส่วนเพื่อจัดการกับเนื้อหาของคุณ",
				lblColTitle: "หัวเรื่อง",
				lblColPubDate: "วันที่แชร์ข้อมูล",
				lblColStatus: "สถานะ",
				checkDisplayReverse: "ส่วนจอแสดงผลในลำดับที่กลับกัน",
				btnApplyWarning: "ยืนยันการยกเลิกในส่วนของ  %NB%",
				deleteTooltip: "ลบทิ้ง",
				firstSectionExplain: "(ส่วนหน้าหลักไม่สามารถย้ายได้)",
				exportMainStage: "เนื้อหาหลัก",
				exportPanel: "เนื้อหา",
				exportActions: "ขั้นตอนการดำเนินการหลัก"
			},
			exportData: {
				btn: "นำเนื้อหาออก",
				tooltip: "การส่งออกเนื้อหาของคุณช่วยให้คุณดูและสร้างวารสารสำรองของคุณ คุณควรตั้งใจลบมัน เพียงแค่คัดลอกวางเนื้อหา โดยวางหน้าเนื้อหาลงในโปรแกรมประมวลผลคำใดๆ"
			},
			help: {
				lblHelp: "ช่วยเหลือ",
				lblAdd: "เพิ่มส่วน",
				lblSettings: "การตั้งค่า",
				lblOrga: "รายการองค์กร",
				lblEdit: "แก้ไข",
				lblPublish: "แชร์",
				lblTips: "ทิปส์",
				lblMore: "ต้องการเพิ่ม?",
				lblLink: "เยี่ยมชมเว็บไซย์แผนที่เรื่องราว",
				content1Div1: "คุณสามารถรวมความหลากหลายของรูปแบบที่เมื่อมีการสร้างเรื่องราวของคุณ<strong>% LAYOUT_TITLE% </ strong> โดยทั่วไปแล้วถือข้อความของคุณรูปภาพและวิดีโอในขณะที่แผนที่ของคุณมีแนวโน้มที่จะไปใน <strong> เวทีหลัก </ strong> อย่างไรก็ตาม% TPL_NAME% ช่วยให้คุณสามารถมีลักษณะภาพแผนภูมิและวิดีโอภายในเวทีหลักได้เป็นอย่างดี",
				content1Div2: "กำลังเพิ่มส่วนที่ช่วยให้คุณสามารถปรับแต่งการเล่าเรื่องผ่าน Storytelling ให้ดีขึ้น ในฐานะที่เป็นผู้อ่านผ่าน% ข้อความ LAYOUT_TITLE% ของแผนที่บนเวทีหลักสามารถเลื่อนหรือขยายไปยังจุดสำคัญหรือแผนที่ใหม่และภาพที่สามารถโหลดโดยอัตโนมัติเพื่อสนับสนุนข้อความของคุณ",
				content2Div1: "Here is where you can adjust how your %TPL_NAME% looks. Color schemes, layouts, widths, and fonts are all refined here.",
				content2Div2: "คุณสามารถเพิ่มการแบ่งปันไปยังเฟสบุค ทวิตเตอร์ และ  Bitly ดังนั้นผู้อ่านสามารถกระจายได้ง่าย %TPL_NAME% ไปยังที่อื่นๆ",
				content3Div1: "เนื้อหาของคุณจะถูกจัดแบ่งออกเป็นส่วนๆ คุณสามารถมีส่วนมากเท่าที่คุณต้องการ (คิดว่าพวกเขาชอบเนื้อหาส่วนย่อยๆ) กระบวนการทำงานของส่วนงานเหล่านี้ล้วนมีความสำคัญ ดังนั้นในการจัดระเบียบภายในองค์กร คุณสามารถเรียงลำดับหรือลบส่วนงานต่างๆ ตามที่คุณต้องการได้",
				content4Div1: "พบความผิดพลาดหรือต้องการเปลี่ยนวัสดุของคุณหรือไม่ ไม่ต้องกังวล มองหาไอคอนแก้ไขตลอดทั้งการตรวจสอบการเปลี่ยนแปลงเนื้อหาของคุณ youâ€™? จะใช้ฟังก์ชั่นการแก้ไขหลายครั้งตามที่คุณพัฒนา TPL_NAME% ของ%!",
				content5Div1: "TPL_NAME%% ถูกบันทึกอยู่ในบัญชี PORTAL%% ของคุณและตั้งความเป็นส่วนตัวเป็นค่าตั้งต้น คุณสามารถเลือกได้ว่าจะแชร์ข้อมูลให้กับสมาชิกในองค์กร หรือแชร์ทั่วทั้งโลกก็ได้ เรายังมี URL แบบสั้นที่จะช่วยให้คุณแชร์ลิงก์ได้ง่ายยิ่งขึ้นอีกด้วย",
				content6Div1: "ชื่อของหน้าหลักของคุณยังเป็นชื่อของวารสารของคุณ; คิดว่าในส่วนของหน้าแรกเป็นหน้าปก เพื่อเล่าเรื่องราวของคุณ ชื่อแรกยังคงมองเห็นได้เมื่อผู้อ่านของคุณอ่านวารสาร",
				content6Div2: "%LAYOUT_TITLE% ของคุณไม่จำเป็นต้องมีเพียงข้อความ พิจารณาทั้งภาพถ่ายและวิดีโอจะช่วยนำเรื่องที่มีชีวิต และที่ทำลายส่วนของข้อความ!"
			},
			landing: {
				lblAdd: "คุณต้องการจะเรียกแผนที่การเดินทางของคุณว่าอะไร?",
				phAdd: "ใส่ชื่อเรื่องของคุณ...",
				lblOR: "- หรือ -",
				lblHelp: "ร่วมการเยี่ยมชม"
			},
			firstAddSplash: {
				thisis: "นี่คือ",
				lblMain: "นี่คือ %BR% ขั้นตอนหลัก"
			}
        }
    })

);
