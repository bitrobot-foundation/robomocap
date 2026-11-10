'use strict';
(() => {
  const pairs = [
  ["Citation", "引用"],
  ["If you use this dataset, please cite:", "如果您使用此数据集，请引用："],
  ["RoboMoCap home", "RoboMoCap 主页"],
  ["RoboMoCap interactive recording", "RoboMoCap 交互式录制"],
  ["Action examples", "动作示例"],
  ["Humanoid robot training", "人形机器人训练"],
  ["Interactive example", "可交互示例"],
  ["Play video", "播放视频"],
  ["Pause video", "暂停视频"],
  ["Seek video", "调整播放进度"],
  ["Action categories", "动作类别"],
  ["Tracked object motion", "被跟踪物体的运动"],
  ["About RoboMoCap", "关于 RoboMoCap"],
  ["Egocentric Vision × High-Fidelity Whole-Body Motion", "第一视角视觉 × 高保真全身运动"],
  ["A Large-Scale Whole-Body Motion Capture Dataset with Egocentric Vision for Robot Learning", "面向机器人学习的大规模第一视角视觉与全身动作捕捉数据集"],
  ["High-fidelity whole-body motion.", "高保真全身运动。"],
  ["RoboMoCap pairs multimodal first-person observations with optical whole-body motion capture for humanoid robot learning. With six head-mounted and two wrist-mounted cameras, the dataset captures diverse locomotion and loco-manipulation behaviours, from everyday walking to dynamic movements and complex object interactions.", "RoboMoCap 将多模态第一视角观测与光学全身动作捕捉配对，用于人形机器人学习。数据集使用六路头戴相机和两路腕部相机，记录多样的移动与移动操作行为，涵盖日常行走、动态动作和复杂物体交互。"],
  ["Beyond what egocentric cameras can see.", "超越第一视角相机的可见范围。"],
  ["While many egocentric datasets focus primarily on hand-object interactions, RoboMoCap emphasises locomotion and loco-manipulation. By pairing first-person observations with high-fidelity optical motion capture, it provides accurate supervision for lower-body movement, foot placement, and whole-body coordination during navigation and object interactions.", "许多第一视角数据集主要关注手与物体的交互，而 RoboMoCap 侧重移动与移动操作。通过将第一视角观测与高保真光学动捕配对，数据集为导航和物体交互中的下肢运动、落脚位置及全身协调提供准确监督。"],
  ["A 53-marker NOKOV optical mocap setup records whole-body motion at 120 Hz, including leg and foot movement outside the wearable camera views.", "NOKOV 光学动捕系统使用 53 个标记，以 120 Hz 记录全身运动，包括可穿戴相机视野之外的腿部和足部运动。"],
  ["RoboMoCap defines 290+ actions across eight categories, with a strong emphasis on locomotion and loco-manipulation. Activities range from walking, turning, and dynamic posture transitions to object transport, environmental interactions, and collaborative tasks.", "RoboMoCap 在八个类别中定义了 290 多个动作，重点关注移动与移动操作。活动涵盖行走、转向、动态姿态转换、物体搬运、环境交互和协作任务。"],
  ["The protocols introduce variations in movement speed, direction, terrain, object handling, and carrying configurations. Longer activities combine navigation, reaching, manipulation, and object placement into continuous whole-body motion sequences.", "采集协议覆盖运动速度、方向、地形、物体操作和携带方式的变化。较长的活动将导航、伸手、操作和放置物体组合为连续的全身运动序列。"],
  ["NOKOV Bimodal cam 1.3", "NOKOV Bimodal cam 1.3"],
  ["Tracked object", "被跟踪物体"],
  ["Reflective markers", "反光标记"],
  ["Fitted joints over time", "连续帧拟合关节"],
  ["3D marker tracking", "三维标记跟踪"],
  ["Observed marker positions", "实测标记位置"],
  ["Rigid-body pose", "刚体姿态"],
  ["Position + orientation", "位置 + 朝向"],
  ["Head, wrist & external views", "头戴、腕部与第三视角"],
  ["Time-colored hand motion", "颜色表示手部运动顺序"],
  ["Time-colored body motion", "颜色表示身体运动顺序"],
  ["Time-colored object poses", "颜色表示物体运动顺序"],

  ["Capture, body and hand-pose processing diagram", "采集、身体与手部姿态处理流程图"],
  ["Capture, alignment, and pose fusion", "采集、对齐与姿态融合"],
  ["Camera observations, hand-pose fusion, body reconstruction, and object tracking form one connected pipeline. Transparent overlays show sampled hand, body, and object motion. Colors progress from teal for earlier frames to violet for later frames.", "相机观测、手部姿态融合、身体重建与物体跟踪构成连通流程。透明叠帧展示手部、身体与物体运动，颜色由早期帧的浅青渐变为后期帧的紫色。"],
  ["Alignment & fusion", "对齐与融合"],
  ["Frame alignment", "帧对齐"],
  ["30 fps video paired with 120 Hz motion capture at matching relative times", "30 fps 视频与 120 Hz 动捕按相同相对时间配对"],
  ["RoboCap + RoboWrist", "RoboCap + RoboWrist"],
  ["6 head views + 2 wrist views", "6 路头戴 + 2 路腕部视角"],
  ["1 external camera", "1 路第三视角相机"],
  ["53 markers · 120 Hz", "53 个标记 · 120 Hz"],
  ["Body, wrist & object motion", "身体、腕部与物体运动"],
  ["30 fps / 120 Hz · 1 : 4", "30 fps / 120 Hz · 1 : 4"],
  ["Video : motion = 1 : 4", "视频 : 动捕 = 1 : 4"],
  ["Whole-body markers", "全身动捕标记"],
  ["Optical motion capture", "光学运动捕捉"],
  ["Body joint reconstruction", "身体关节重建"],
  ["Metric positions · 120 Hz", "公制位置 · 120 Hz"],
  ["Body motion sequence", "身体运动序列"],
  ["Measured joints over time", "连续帧实测关节"],
  ["SMPL-X body motion", "SMPL-X 人体运动"],
  ["Local hand pose", "局部手部姿态"],
  ["Video-based prediction", "由视频预测"],
  ["Procrustes alignment", "Procrustes 对齐"],
  ["Local pose alignment", "局部姿态对齐"],
  ["Metric coordinates", "公制坐标"],
  ["Body, wrist & objects", "身体、腕部与物体"],
  ["Wrist-pose fusion", "腕部姿态融合"],
  ["Aligned hand + wrist", "对齐的手部 + 腕部"],
  ["Wrist pose", "腕部姿态"],
  ["Body & markers", "身体与标记"],
  ["World-frame hand pose", "世界坐标系手部姿态"],
  ["Aligned hand pose", "对齐的手部姿态"],
  ["+ metric wrist pose", "+ 公制腕部姿态"],
  ["Body joints", "身体关节"],
  ["Object markers", "物体标记"],
  ["Egocentric vision × Whole-body motion", "第一视角视觉 × 全身运动"],
  ["Egocentric vision.", "第一视角视觉。"],
  ["Whole-body motion.", "全身运动。"],
  ["Capture system", "采集系统"],
  ["Data", "数据"],
  ["modalities", "模态"],
  ["and processing", "与处理"],
  ["Dataset", "数据集"],
  ["structure", "结构"],
  ["Contributors", "参与团队"],
  ["About RoboCap-Whole-Body", "关于 RoboCap-Whole-Body"],
  ["RoboCap-Whole-Body pairs first-person observations with optical whole-body motion capture for humanoid learning. Six head-mounted cameras and two wrist-mounted cameras record activities such as walking, turning, and carrying objects.", "RoboCap-Whole-Body 将第一视角观测与光学全身动捕配对，用于人形机器人学习。六路头戴相机与两路腕部相机记录行走、转向和搬运物体等活动。"],
  ["Head-mounted cameras often see only part of the body. Optical motion capture measures movement beyond those views, enabling the study of lower-body motion and how foot placement, body posture, and hand actions work together.", "头戴相机通常只能看到部分身体。光学动捕补充画面之外的运动信息，用于研究下肢运动，以及落脚位置、身体姿态与双手操作之间的协调。"],
  ["Data modalities", "数据模态"],
  ["Data example", "数据示例"],
  ["HH03 · Handover while walking", "HH03 · 行走中交接"],
  ["SMPL-X body motion from a balance-recovery recording", "平衡恢复录制中的 SMPL-X 人体运动"],
  ["Observed hand joints projected onto fabric manipulation video", "投影至布料操作视频中的实测手部关节"],
  ["Hand pose", "手部姿态"],
  ["Hand pose complements wrist video to describe hand movements during interaction.", "手部姿态与腕部视频共同呈现交互中的手部运动。"],
  ["View dataset ↗", "查看数据集 ↗"],
  ["Code", "代码"],
  ["Paper", "论文"],
  ["Coming soon", "敬请期待"],
  ["Egocentric sensing", "第一视角感知"],
  ["Wrist sensing", "腕部感知"],
  ["Six head-mounted cameras provide complementary forward, downward, and side views, alongside IMU, magnetometer measurements, and WAV audio.", "六路头戴相机提供互补的前向、下视与侧向观测，同时记录 IMU、磁力计数据与 WAV 音频。"],
  ["Left and right wrist cameras record close-range hand–object interactions, alongside IMU and magnetometer measurements.", "左右腕部相机贴近双手记录物体操作，同时采集 IMU 与磁力计数据。"],
  ["Dataset structure", "数据结构"],
  ["A 53-marker NOKOV setup records whole-body motion at 120 Hz, including leg and foot movement outside the wearable camera views.", "NOKOV 通过 53 个反光标记，以 120 Hz 记录人体运动，覆盖相机画面之外的腿部与足部运动。"],
  ["NOKOV's third-person video records the participant, manipulated objects, and the surrounding space.", "NOKOV 第三视角视频记录参与者、被操作的物体与周围空间。"],
  ["Object motion", "物体运动"],
  ["Object geometry", "物体几何"],
  ["3D scans", "三维扫描"],
  ["Cardboard box with reflective motion-capture markers", "贴有反光动捕标记的纸箱"],
  ["3D scan of a green cone", "绿色锥体的三维扫描"],
  ["Reflective markers track manipulated objects alongside the participant's body motion.", "反光标记追踪被操作物体的运动，与人体动捕共同记录交互过程。"],
  ["Textured 3D scans preserve the shape and appearance of objects used in the recordings.", "带纹理的三维扫描保留采集物体的形状与外观。"],
  ["Participant manipulating tracked boxes in the capture space", "参与者在采集空间中操作带动捕标记的箱体"],
  ["RoboCap six-camera array", "RoboCap 六相机阵列"],
  ["RoboWrist camera modules", "RoboWrist 相机模块"],
  ["Egocentric video", "第一视角视频"],
  ["Wrist video", "腕部视频"],
  ["Whole-body motion", "全身运动"],
  ["External video", "第三视角视频"],
  ["The capture space", "采集现场"],
  ["Six head-mounted cameras record the scene around the participant, with forward, eye-level, and side views.", "六路头戴相机记录参与者周围的场景，覆盖前方、眼部与侧方视角。"],
  ["Left and right wrist cameras stay close to the hands and the objects being manipulated.", "左右腕部相机贴近双手，记录操作中的物体。"],
  ["Optical motion capture measures body joints and reflective markers in the recording space.", "光学动捕记录采集空间中的身体关节与反光标记。"],
  ["A third-person camera records the participant, manipulated objects, and the surrounding space.", "第三视角相机记录参与者、被操作的物体与周围空间。"],
  ["The participant wears RoboCap and RoboWrist while the NOKOV system records body motion. Reflective markers track the person and objects during the activity.", "参与者佩戴 RoboCap 与 RoboWrist，由 NOKOV 系统记录身体运动。反光标记追踪活动中的人体与物体。"],
  ["Pause background video", "暂停背景视频"],
  ["Play background video", "播放背景视频"],
  ["Data distribution", "数据分布"],
  ["Recording time is counted once per recording, across all camera views. These are index totals; the final release may differ after quality review.", "每条录制的时长只计一次，不累加相机数量。这里展示当前索引统计，最终发布规模将随质量审核更新。"],
  ["Large-Scale Whole-Body Motion Capture with Egocentric Vision for Robot Learning", "面向机器人学习的大规模第一视角视觉与全身动作捕捉"],
  [
    "Skip to content",
    "跳转至正文"
  ],
  [
    "Overview",
    "概述"
  ],
  [
    "Dataset",
    "数据集"
  ],
  [
    "Back to top ↑",
    "回到顶部 ↑"
  ],
  [
    "Open navigation",
    "打开导航"
  ],
  [
    "Close navigation",
    "关闭导航"
  ],
  [
    "Main navigation",
    "主导航"
  ],
  [
    "Mobile navigation",
    "移动端导航"
  ],
  [
    "Website language",
    "网站语言"
  ],
  [
    "RoboCap-Whole-Body home",
    "RoboCap-Whole-Body 主页"
  ],
  [
    "RoboCap-Whole-Body interactive recording",
    "RoboCap-Whole-Body 交互式录制"
  ],
  [
    "Open media",
    "查看素材"
  ],
  [
    "Explore action families",
    "探索动作类别"
  ],
  [
    "captured actions",
    "个已采集动作"
  ],
  [
    "The activity catalog could not be loaded. Refresh to try again.",
    "动作目录加载失败，请刷新后重试。"
  ],
  [
    "Locomotion",
    "移动"
  ],
  [
    "Posture & dynamics",
    "姿态与动态"
  ],
  [
    "Stationary manipulation",
    "原地操作"
  ],
  [
    "Locomotion & manipulation",
    "移动与操作"
  ],
  [
    "Dynamic recovery",
    "动态恢复"
  ],
  [
    "Human–human interaction",
    "人与人交互"
  ],
  [
    "Environment-coupled motion",
    "环境耦合运动"
  ],
  [
    "Long-horizon tasks",
    "长时序任务"
  ],
  [
    "Live motion capture at the recording space",
    "采集空间中的实时动作捕捉"
  ],
  [
    "Play clip",
    "播放片段"
  ],
  [
    "Capture system",
    "采集系统"
  ],
  [
    "families",
    "个类别"
  ],
  [
    "System",
    "采集系统"
  ],
  [
    "Pipeline",
    "处理流程"
  ],
  [
    "Evaluation",
    "评测"
  ],
  [
    "Research project · October 2026",
    "研究项目 · 2026 年 10 月"
  ],
  [
    "Recording what a person sees alongside how their body moves, using wearable cameras and optical motion capture.",
    "通过可穿戴相机与光学动作捕捉，同时记录一个人看到的画面与身体的运动。"
  ],
  [
    "Research question",
    "研究问题"
  ],
  [
    "A head-mounted camera follows an action closely, but it does not see the whole person. While someone carries a box, the camera may show the hands and the path ahead; the feet, changes in balance, and much of the posture remain outside the frame.",
    "头戴相机能够贴近动作，却看不到完整的人。搬运箱子时，画面可能包含双手与前方路径，而脚步、重心变化和大部分身体姿态仍然在视野之外。"
  ],
  [
    "RoboCap-Whole-Body pairs camera observations with measured body motion. The collection protocol includes locomotion, manipulation, balance recovery, and interaction with other people. Together, these recordings provide a way to study how a visual observation relates to the movement of the body.",
    "RoboCap-Whole-Body 将相机观测与测得的身体运动配对。采集协议包含移动、操作、平衡恢复和人与人交互，以此研究视觉观测与身体运动之间的对应关系。"
  ],
  [
    "Head and wrist cameras record the scene from the participant’s perspective.",
    "头部与腕部相机从参与者的视角记录动作环境。"
  ],
  [
    "Optical motion capture adds body motion that the wearable cameras cannot fully observe.",
    "光学动作捕捉补充可穿戴相机无法完整观测的身体运动。"
  ],
  [
    "Paired recordings let researchers examine camera observations and motion on a shared sample.",
    "配对记录让研究者在同一个样本中检查相机观测与运动表示。"
  ],
  [
    "Data processing",
    "数据处理"
  ],
  [
    "Time",
    "时间"
  ],
  [
    "Space",
    "空间"
  ],
  [
    "Quality",
    "质量"
  ],
  [
    "Recording examples",
    "录制样例"
  ],
  [
    "Dataset organization",
    "数据组织"
  ],
  [
    "The action taxonomy",
    "动作分类"
  ],
  [
    "Coverage in the released data",
    "实际发布数据的覆盖范围"
  ],
  [
    "Research project · 2026",
    "研究项目 · 2026"
  ],
  [
    "Project teaser",
    "项目发布视频"
  ],
  [
    "Dataset ↗",
    "数据集 ↗"
  ],
  [
    "Interactive sample ↓",
    "交互样本 ↓"
  ],
  [
    "· Head-mounted cameras",
    "· 头部相机"
  ],
  [
    "· Wrist-mounted cameras",
    "· 腕部相机"
  ],
  [
    "· Development capture room",
    "· 开发阶段采集空间"
  ],
  [
    "Egocentric Video",
    "第一视角视频"
  ],
  [
    "and Whole-Body Motion",
    "与全身运动"
  ],
  [
    "Examples",
    "样例"
  ],
  [
    "In the capture space",
    "采集现场"
  ],
  [
    "Two people approach, exchange boxes, and walk away. Their head-mounted cameras and body motion record the same interaction from different perspectives.",
    "两个人走近、交换箱子，再各自走开。头戴相机与身体动捕从不同角度记录同一次交互。"
  ],
  [
    "HH03 · Handover while walking. Third-person view, source seconds 14–26.",
    "HH03 · 行走中交接。第三视角，原始片段第 14–26 秒。"
  ],
  [
    "The participant wears RoboCap and RoboWrist while the NOKOV system records body motion. Head-mounted cameras observe the surrounding scene; wrist-mounted cameras stay close to the hands and manipulated objects. Reflective markers allow the optical system to measure motion in the capture space.",
    "参与者佩戴 RoboCap 与 RoboWrist，由 NOKOV 系统记录身体运动。头戴相机观察周围场景，腕部相机贴近双手与被操作的物体。反光标记让光学系统能够测量采集空间中的运动。"
  ],
  [
    "Camera frames and motion-capture measurements are associated in time and expressed in compatible coordinate systems. The sample below retains the original camera views, body skeletons, and observed markers, so their correspondence can be inspected directly.",
    "相机画面与动捕测量在时间上建立对应，并使用兼容的坐标系统表示。下方样例保留原始相机画面、身体骨架与实测标记，便于直接检查它们之间的关系。"
  ],
  [
    "Camera frames and motion measurements share a frame timeline for inspection.",
    "相机画面与运动测量放在同一帧时间轴中，便于对照检查。"
  ],
  [
    "Body joints and observed markers are expressed in meters within the capture coordinate frame.",
    "身体关节与实测标记在采集坐标系中统一以米表示。"
  ],
  [
    "Missing object markers remain missing; the preview does not fill their trajectories.",
    "物体标记的缺失会保留，预览不会补造轨迹。"
  ],
  [
    "In this handover, both people move while exchanging objects. Six RoboCap views, two RoboWrist views, and one external view show the interaction. The 3D recording adds two body skeletons and measured markers on two boxes, making it possible to examine the people, objects, and observations together.",
    "这次交接中，两个人在移动的同时交换物体。六路 RoboCap、两路 RoboWrist 和一路第三视角共同记录交互。三维录制还包含两套人体骨架与两个箱子的实测标记，可以把人、物体和相机观测放在一起检查。"
  ],
  [
    "HH03",
    "HH03"
  ],
  [
    "Handover while walking",
    "行走中交接"
  ],
  [
    "Third-person camera",
    "第三人称相机"
  ],
  [
    "Left front",
    "左前"
  ],
  [
    "Right front",
    "右前"
  ],
  [
    "Left eye",
    "左眼"
  ],
  [
    "Right eye",
    "右眼"
  ],
  [
    "Left",
    "左侧"
  ],
  [
    "Right",
    "右侧"
  ],
  [
    "Frame pairing: 120 Hz motion capture / 30 fps video, with zero offset between stream starts. Only observed object markers are shown.",
    "帧配对：120 Hz 动捕 / 30 fps 视频，各数据流起点按零偏移处理。物体显示实际观测到的标记。"
  ],
  [
    "Activities vary movement direction, speed, turning, posture, and carrying configuration. Sideways and backward walking, circular and figure-eight paths, balance recovery, and object transport capture different forms of whole-body coordination. Longer tasks combine reaching, carrying, and placement within a continuous recording.",
    "动作覆盖不同的移动方向、速度、转向、姿态与持物方式。侧行、倒退、绕圈与 8 字行走、平衡恢复和物体搬运，记录多种全身协调方式。较长任务将触达、搬运与放置保留在连续录制中。"
  ],
  [
    "All activities",
    "全部动作"
  ],
  [
    "SM43 · Reach, grasp, and place.",
    "SM43 · 触达、抓取与放置。"
  ],
  [
    "LM05 · Carry an object across the room.",
    "LM05 · 持物穿越房间。"
  ],
  [
    "HH03 · Exchange objects while walking.",
    "HH03 · 行走中交换物体。"
  ],
  [
    "Duration, episodes, participants, and action coverage describe the scale and diversity of a release. Collection-protocol counts above describe designed activities; release totals will be reported from the final manifest.",
    "时长、片段、参与者与动作覆盖度共同描述数据的规模与多样性。上方数量对应方案中设计的动作；发布数据的统计将以最终清单为准。"
  ],
  [
    "Paired video and measured motion can support the study of whole-body movement from egocentric observations, including actions involving another person or a carried object. Evaluation tasks, splits, and results will accompany the paper.",
    "配对的视频与实测运动可用于研究如何从第一视角观测理解全身运动，包括涉及另一个人或被搬物体的动作。评测任务、数据划分与结果将随论文一同给出。"
  ],
  [
    "Close media",
    "关闭媒体"
  ],
  [
    "Representative activities",
    "代表动作"
  ],
  [
    "299 designed primitives across eight action families.",
    "8 个动作族，共 299 个设计动作基元。"
  ],
  [
    "Wearable capture system",
    "可穿戴采集系统"
  ],
  [
    "Optical motion-capture space",
    "光学动捕空间"
  ],
  [
    "paper overview",
    "项目总览图"
  ],
  [
    "pipeline figure",
    "数据处理图"
  ],
  [
    "dataset statistics",
    "数据统计图"
  ],
  [
    "benchmark protocol",
    "评测方案图"
  ],
  [
    "RoboCap / left front",
    "RoboCap / 左前"
  ],
  [
    "RoboCap / right front",
    "RoboCap / 右前"
  ],
  [
    "RoboCap / left eye",
    "RoboCap / 左眼"
  ],
  [
    "RoboCap / right eye",
    "RoboCap / 右眼"
  ],
  [
    "RoboCap / left",
    "RoboCap / 左侧"
  ],
  [
    "RoboCap / right",
    "RoboCap / 右侧"
  ],
  [
    "Egocentric video and body motion",
    "第一视角视频与身体运动"
  ],
  [
    "RoboCap, RoboWrist & NOKOV",
    "RoboCap、RoboWrist 与 NOKOV"
  ],
  [
    "Time, coordinates, and missing data",
    "时间、坐标与缺失数据"
  ],
  [
    "RoboCap, RoboWrist, and an external view",
    "RoboCap、RoboWrist 与第三视角"
  ],
  [
    "Movement, manipulation, and interaction",
    "移动、操作与交互"
  ],
  [
    "Evaluation protocol",
    "评测方案"
  ],
  [
    "Wearable video",
    "可穿戴相机视频"
  ],
  [
    "Optical motion capture",
    "光学动作捕捉"
  ],
  [
    "Paired observations",
    "配对观测"
  ],
  [
    "RoboCap, RoboWrist, reflective markers, and the recording space.",
    "RoboCap、RoboWrist、反光标记与采集空间。"
  ],
  [
    "Scroll categories left",
    "向左滚动动作分类"
  ],
  [
    "Scroll categories right",
    "向右滚动动作分类"
  ],
  [
    "Open the local HTTP preview to use the 3D viewer.",
    "通过本地 HTTP 预览打开三维查看器。"
  ],
  [
    "Pick and place at a table",
    "桌面抓取与放置"
  ],
  [
    "A participant reaches for a box, lifts it, and places it on the table. The recording captures the hand movement together with the posture and steps that support it.",
    "参与者伸手抓取箱子，再将其放到桌面。录制同时记录手部动作，以及配合操作的身体姿态和脚步。"
  ],
  [
    "SM43 · Pick and place",
    "SM43 · 抓取与放置"
  ],
  [
    "Capture and processing",
    "采集与处理"
  ],
  [
    "RoboCap and RoboWrist record video and inertial measurements. NOKOV measures body and object markers and tracks a rigid marker cluster on the headset. The headset pose and camera calibration place all six head-mounted views in the motion-capture coordinate frame.",
    "RoboCap 与 RoboWrist 记录视频和惯性数据；NOKOV 记录身体、物体标记，并追踪帽子上的刚性标记组。结合帽子位姿与相机标定，六路头戴视角可置于动捕坐标系中。"
  ],
  [
    "Capture, frame pairing, and data representations",
    "采集、帧配对与数据表示"
  ],
  [
    "Capture",
    "采集"
  ],
  [
    "Participant wearing RoboCap, RoboWrist, and optical markers",
    "佩戴 RoboCap、RoboWrist 与光学标记的参与者"
  ],
  [
    "6 head-mounted views",
    "6 路头戴视角"
  ],
  [
    "2 wrist-mounted views",
    "2 路腕部视角"
  ],
  [
    "Body & object markers",
    "身体与物体标记"
  ],
  [
    "External camera",
    "外部相机"
  ],
  [
    "1 third-person view",
    "1 路第三视角"
  ],
  [
    "Cameras and optical motion capture",
    "相机与光学动捕共同采集"
  ],
  [
    "Time & coordinates",
    "时间与坐标"
  ],
  [
    "Relative-time pairing",
    "按相对时间配对"
  ],
  [
    "30 fps video and 120 Hz motion capture",
    "30 fps 视频与 120 Hz 动捕"
  ],
  [
    "External view",
    "第三视角"
  ],
  [
    "Body motion",
    "身体运动"
  ],
  [
    "30 fps video",
    "30 fps 视频"
  ],
  [
    "120 Hz motion",
    "120 Hz 动捕"
  ],
  [
    "Shared spatial units",
    "统一空间单位"
  ],
  [
    "Body joints and markers in meters",
    "身体关节与标记统一为米"
  ],
  [
    "Frame ratio: 1 video frame / 4 motion samples",
    "帧数比例：1 帧视频 / 4 帧动捕"
  ],
  [
    "Representations",
    "数据表示"
  ],
  [
    "SM43 head-mounted camera frame",
    "SM43 头戴相机画面"
  ],
  [
    "SM43 measured body pose",
    "SM43 实测身体姿态"
  ],
  [
    "Camera observations",
    "相机观测"
  ],
  [
    "Original views",
    "保留原始视角"
  ],
  [
    "Measured joints",
    "实测关节"
  ],
  [
    "Observed markers",
    "观测到的标记"
  ],
  [
    "Measured marker tracks",
    "实测标记轨迹"
  ],
  [
    "Video, skeletons, and marker tracks",
    "视频、骨架与标记轨迹"
  ],
  [
    "Video and body motion over time",
    "视频与身体运动的时间对照"
  ],
  [
    "Compare activities",
    "切换动作对照"
  ],
  [
    "Frames are sampled at matching elapsed times from each stream start.",
    "画面按各数据流起点的相同相对时间抽取。"
  ]
];
  const lookup = new Map();
  pairs.forEach(pair => {lookup.set(pair[0],pair); lookup.set(pair[1],pair);});
  const originals = new WeakMap();
  const originalAttrs = new WeakMap();
  let locale = 'en';
  try {if(localStorage.getItem('egomotion-language') === 'zh') locale = 'zh';} catch {}
  function translate(text) {return lookup.get(text)?.[locale === 'en' ? 0 : 1] ?? text;}
  function refresh(root = document.body) {
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()) {
      const node = walker.currentNode;
      if(node.parentElement?.closest('script,style,[data-language],[data-localized]')) continue;
      if(!originals.has(node)) originals.set(node,node.nodeValue);
      const original = originals.get(node);
      const key = original.trim();
      if(lookup.has(key)) node.nodeValue = original.replace(key,translate(key));
    }
    root.querySelectorAll('[aria-label],[title],[alt]').forEach(element => {
      if(element.closest('[data-localized],[data-asset]')) return;
      let values = originalAttrs.get(element);
      if(!values){values={};originalAttrs.set(element,values);}
      ['aria-label','title','alt'].forEach(attr => {
        const value=element.getAttribute(attr); if(value === null)return;
        if(!(attr in values)) values[attr]=value;
        element.setAttribute(attr,translate(values[attr]));
      });
    });
  }
  function setLanguage(next) {
    if(!['en','zh'].includes(next)) return;
    locale = next;
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    document.title = locale === 'zh' ? 'RoboMoCap — 第一视角视觉与全身动作捕捉' : 'RoboMoCap — Whole-body motion capture for robot learning';
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.language === locale)));
    refresh();
    try {localStorage.setItem('egomotion-language',locale);} catch {}
    document.dispatchEvent(new CustomEvent('languagechange',{detail:{locale}}));
  }
  window.egoI18n = {get locale(){return locale;},translate,refresh,setLanguage};
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click',() => setLanguage(button.dataset.language)));
  setLanguage(locale);
})();
