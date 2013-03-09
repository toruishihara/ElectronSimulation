var results = [
'{"num":2,"vertex":[-7.868028916603216e-19,0,1,1.2167383249057751e-16,0,-1],"angle1":"180.000000","angle2":"180.000000"}',
'{"num":3,"vertex":[0.49261732812163483,-7.498371591137507e-15,0.8702460387926518,0.49261732812163517,-7.498371591137691e-15,-0.8702460387926515,-1,1.5221493770284367e-14,-1.190834183469293e-15],"angle1":"119.512809","angle2":"119.512809"}',
'{"num":4,"vertex":[0.5432699954346338,-0.19542548579512903,0.8164965349358138,0.543269995434633,-0.1954254857951255,-0.8164965349358152,-0.8196432435635536,-0.5728742909928995,-4.423532146842034e-16,-0.2668963116183609,0.963725250704014,3.039128898192391e-15],"angle1":"109.471211","angle2":"109.471221"}',
'{"num":5,"vertex":[0.4940543193155354,0.07687804636849294,0.8660254589515407,0.4940543193155327,0.07687804636849037,-0.8660254589515425,-0.9881088303651835,-0.15375610347023297,1.8699317283101184e-15,-0.1537562742346389,0.988108803793126,-1.2547841939856675e-15,0.15375603563846676,-0.9881088409202413,1.3999323061599374e-15],"angle1":"89.999990","angle2":"90.000002"}',
'{"num":6,"vertex":[4.1608531582480297e-8,-4.2780980328528734e-8,0.9999999999999982,4.160853932702902e-8,-4.2780982760784815e-8,-0.9999999999999982,-0.9243579385267813,-0.3815264099410669,-3.1245706252242547e-15,-0.3815266641539085,0.9243578336010306,-2.5838992596897885e-15,0.3815267102842559,-0.9243578145608298,2.5814513862286733e-15,0.9243579802711291,0.3815263088033103,3.1315795513826034e-15],"angle1":"89.999976","angle2":"89.999997"}',
'{"num":7,"vertex":[0.0569257806257036,-0.01960080928051901,0.9981859865654813,-0.056925778260998705,0.01960080891507948,-0.9981859867075142,-0.6883264638951808,-0.7249695758961857,0.02501585750001167,0.1318023240007547,0.9912040487022858,0.011944924620810256,0.47506554269605294,-0.8788321681374732,-0.044348059593322185,0.9819329010493505,0.1818215001099354,-0.05242823604298677,-0.9004743069241905,0.4307761960765536,0.059815478458451206],"angle1":"72.000000","angle2":"89.999825"}',
'{"num":8,"vertex":[0.2901160216585077,-0.2651934871001202,0.9195135172343681,0.26561799198121677,-0.03652165608014744,-0.9633863456438593,-0.7089558376994766,-0.6713816092333724,0.21593599740441796,0.15322182190434408,0.9730967716415114,-0.17206320441390602,0.3624167428201375,-0.9121251197999662,-0.19152511676941902,0.9792437599878021,0.1837203855133625,0.08560653288022588,-0.8057546333529304,0.20422191214025828,-0.5559252480613389,-0.5359059134865342,0.5241831698929382,0.6618435285557716],"angle1":"71.694140","angle2":"71.694160"}',
'{"num":9,"vertex":[0.26026424616253907,-0.4648207984793338,0.8462884540571729,0.32954617212481774,-0.005769907682248056,-0.9441218293224758,-0.7109007577920888,-0.6427891801536565,0.2853807674809641,0.010706592726821553,0.9256533828216328,-0.37822107786723075,0.2234518266484104,-0.9297532087629206,-0.29262305439343295,0.9995520925093466,-0.012187896532529312,-0.02733257284448361,-0.7653936567481677,0.008087994680193923,-0.6435115652043258,-0.7285811858147591,0.4730203888756381,0.4954000074532696,0.3813545408378568,0.6485590272258231,0.6587411497593278],"angle1":"69.189745","angle2":"69.189752"}',
'{"num":10,"vertex":[0.15748067506206861,-0.46794694438705964,0.8696122665997814,0.2652809115481643,-0.07426319079890793,-0.9613069314534979,-0.7317613019946603,-0.6188487408596007,0.28557246512849627,-0.306804792529049,0.8892698674998126,-0.33921957791093477,0.09521938875287657,-0.9429003346770638,-0.3191742891766342,0.9254174024232458,-0.36611069893995735,0.09780382105985584,-0.7760932870019067,-0.055212215294013656,-0.6281964829198773,-0.7138320156066343,0.4197411603532567,0.5605900568153805,0.35333170718190304,0.5974223566430845,0.7198911254369961,0.731761318175448,0.6188487331078657,-0.28557244046462277],"angle1":"64.995624","angle2":"64.995629"}',
'{"num":11,"vertex":[0.1456618616023256,-0.40178544285589346,0.90407470929323,0.325920903851009,-0.003174806364071781,-0.9453917098417418,-0.7189212438604219,-0.6069333456463155,0.33879810960032514,-0.21944701664193456,0.9411938131530666,-0.256899227264982,0.3291909646112829,-0.9422628702830154,-0.061432825950840486,0.9613706203822984,-0.22807087580137927,0.15411101802579397,-0.8516268642300617,0.22700179346362734,-0.47244245140119306,-0.6710169161783919,0.4069030086142682,0.6198114550273317,0.3586603801671414,0.6104426933454372,0.7062028390197325,0.7220062037765886,0.6242981671897468,-0.2982596857633329,-0.3861074530143069,-0.6275701615770818,-0.6760744981323583],"angle1":"58.539558","angle2":"63.548738"}',
'{"num":12,"vertex":[0.001382427316856586,-0.27086465232718654,0.962616449586431,-0.0013824204883692824,0.27086465629219253,-0.9626164484805492,-0.7603068012674563,-0.5739436315333205,0.30417474544871836,-0.21256867109190997,0.9575229184040485,-0.19484460680555996,0.21256865641352876,-0.9575229158458913,0.19484463539068603,0.8925358499719028,-0.18524163711143327,0.4111755007234854,-0.8925358420010601,0.18524162238148004,-0.41117552466183555,-0.6816097143623971,0.43540268263630016,0.5880754213873632,0.33990321038245347,0.6756337152792394,0.6542055413627074,0.7603068181098647,0.5739435934540389,-0.3041747752012287,-0.33990325732837184,-0.6756337063945683,-0.6542055261468684,0.6816097501248672,-0.4354026361864043,-0.5880754143276574],"angle1":"63.434943","angle2":"63.434949"}',
'{"num":13,"vertex":[-0.05337934018304093,-0.08910664398704862,0.9945906957331686,0.05641561886182892,0.293836984477388,-0.9541892393554183,-0.7371439404825785,-0.5707648725709527,0.36172679089180154,-0.2590356371315474,0.9329159845440341,-0.2501365716525446,-0.014548083391173633,-0.9809757095243337,-0.1935846341858605,0.9248707295057308,0.017695947648016172,0.379869697581126,-0.921834705135855,0.18703442993252986,-0.339468552927815,-0.6991745558332476,0.457071352887497,0.5497642393289821,0.2841430481102708,0.7602025123890698,0.5842558244193637,0.7150202673538797,0.6114681696120025,-0.3388992399291178,-0.43430457300086683,-0.4643960953204996,-0.7718262787192518,0.7225788425071608,-0.4113980976906199,-0.555546057116375,0.41652062115605626,-0.7349313962611455,0.5351508338229662],"angle1":"52.316924","angle2":"60.119731"}',
'{"num":14,"vertex":[0.07352648607232522,-0.002801336442285713,0.9972893303149258,0.18005101995944067,0.3772254751371716,-0.9084506431937293,-0.478355769831662,-0.6024847756177683,0.6388958073250797,-0.21559504153768433,0.9614153118839458,-0.17087824946276706,-0.047506450062371405,-0.9771517234204682,-0.2071657467316455,0.9083816718190296,0.06153044067184948,0.41359006658041564,-0.7674773131214381,0.3617318882077872,-0.5292717779152097,-0.7619673832014365,0.3941106054354811,0.5138896161827303,0.20490685365419273,0.7791486900412727,0.5924023127339293,0.741457269262055,0.6182211927253031,-0.26085182522604694,-0.2144308486516637,-0.4204609943721107,-0.8816076016903116,0.761967375489964,-0.394110613013957,-0.5138896218048183,0.5138997826290778,-0.7361560424604433,0.4404330761452466,-0.8988576822835579,-0.42021815535421375,-0.12438476156882097],"angle1":"52.866089","angle2":"62.911397"}',
'{"num":15,"vertex":[-0.023824266625824236,0.009731971767389365,0.9996687916731524,0.04125672251979616,0.4197213435289982,-0.9067148816651999,-0.4592770940053287,-0.6558583197802176,0.5990946630517504,-0.09038710619798357,0.976714283124344,-0.19457487035599633,-0.03964206764994411,-0.9765992740833086,-0.21138203408140405,0.8159905048974139,0.1950503897702279,0.5441643514304713,-0.7892036255385417,0.4648575176020186,-0.4013291987455062,-0.7288696952388078,0.4254637953338983,0.5364042563426971,0.16246772291480943,0.7990278196476007,0.5789289960263504,0.7685116726605433,0.5511355675067195,-0.3250221457278571,-0.4954747382605651,-0.3821453906760259,-0.7800446680355504,0.9082058298323984,-0.39021827710532053,-0.151300584504489,0.451255535903005,-0.7072159408659209,0.5442555046134323,-0.9381010944759288,-0.34626662204133635,-0.00810943913886616,0.4170916953730026,-0.3833988566582888,-0.8240387335338013],"angle1":"49.224875","angle2":"56.100906"}',
'{"num":16,"vertex":[0.05439125021912941,-0.002638694419468903,0.9985162137849143,0.058231645279686335,0.5024705841766318,-0.8626310842563089,-0.5348069740022209,-0.5555093445571205,0.6367031244373678,-0.3153520185374396,0.9377319783305657,-0.1456428550276521,-0.09360255119143832,-0.977455808802866,-0.1892583003410661,0.8302602015267107,0.15802153003758904,0.5345064955689547,-0.8459878011242671,0.3541050650794125,-0.3986404937208872,-0.7948892804610035,0.3169637036377941,0.51738287793896,0.0013709638640437842,0.7514522870905783,0.6597860112827661,0.8453682639448765,0.210050969339509,-0.4911528159283609,-0.428963032795707,-0.27581261326694334,-0.860184932940335,0.8310760583997203,-0.5543501147387859,-0.04481668711405506,0.33026372166982143,-0.7374869662081177,0.5891000329502158,-0.865899252806532,-0.48575560758652336,-0.11941513173520846,0.37320083666076537,-0.47300095516159024,-0.7981173046187684,0.555337963738061,0.83121399175769,-0.02613514755097229],"angle1":"48.936219","angle2":"54.658029"}',
'{"num":17,"vertex":[-0.19928845657341393,0.009090113544357419,0.97989870951662,0.03787365308824737,0.5896490976835422,-0.8067710505482555,-0.4549900702431057,-0.6855602520858836,0.5683231270501962,-0.19704628203952365,0.979161005962951,-0.04915777798092913,0.1970458577386332,-0.9791610866177336,0.049157872224348295,0.8513597228831205,0.19576101449580485,0.48668701180116736,-0.7950193540855234,0.4416670414300165,-0.4157817349810997,-0.6952118570755503,0.5081495097304202,0.5083940888152597,0.19936559415494243,0.6972201778798464,0.6885763453854933,0.7254580450755064,0.11189692440346354,-0.6791094927508154,-0.40300178906548145,-0.1266048782619336,-0.9063998912236818,0.8926591346175308,-0.4461207657625501,-0.06431121005949755,0.43958749553544657,-0.4964901650304976,0.7485054106663912,-0.9745269647607085,-0.19014306776286838,0.11892354155509394,0.2780955383566378,-0.604061177001231,-0.7468419953283421,0.6524372600943291,0.7475894449377685,-0.12424026504416222,-0.554797523132285,-0.7520429339707763,-0.35585268551875227],"angle1":"50.108065","angle2":"52.442473"}',
'{"num":18,"vertex":[-0.21779510270784158,0.029413496141430656,0.975551197775503,-0.010370084031377805,0.6985915565259884,-0.7154455244865112,-0.5325171648519372,-0.6054976651575493,0.591437271928994,-0.2532300933192376,0.9595493807308805,0.12304269899719385,0.16462650274163107,-0.947583359509358,0.2738318669841379,0.8881686390550044,0.22622383674538205,0.3999740545177647,-0.7627889831124365,0.5125564565255889,-0.3942573348921072,-0.7551339415386559,0.41054406142419886,0.5111030267623324,0.2384296959004458,0.6452145262758807,0.7258439881926501,0.8495993237339582,0.14607864246573463,-0.5067958359400448,-0.5555118368934739,-0.1857955180603035,-0.810485425248315,0.851392576475793,-0.5245224788656941,-0.002617228782173252,0.46104646996869064,-0.3708271953734337,0.8061782332095566,-0.976772227447027,-0.21425780936424973,-0.0030994861842277015,0.3044575753404511,-0.7383084256079648,-0.6018357363052662,0.5559233724632867,0.8240239964040779,-0.10924128019800038,-0.46731972951286577,-0.8359900543582436,-0.28763327245317605,0.21779513648642654,-0.02941351407268301,-0.9755511896936804],"angle1":"47.534418","angle2":"49.605452"}',
'{"num":19,"vertex":[-0.15416311757959508,-0.1472922447308104,0.9770049784009797,0.09772569092586537,0.7342131210116454,-0.6718487793152571,-0.6945652656506062,-0.4747567548571286,0.5405415020784542,-0.21100915569680975,0.9517481844552048,0.22282398793294458,0.18128291623536405,-0.8811747731734817,0.43665492485928203,0.8995755659328414,0.2778044836166656,0.3370288860900287,-0.751416362825626,0.62428634377955,-0.21363522801323928,-0.7092325977304687,0.37357268815140904,0.5978566458473313,0.20894088849334583,0.5606471215150801,0.8012605757507768,0.834621814255403,0.20162187887422492,-0.512596376429103,-0.4276051278439008,-0.5264045434562207,-0.7348823792078899,0.870438756980941,-0.4908535395883593,-0.037405521237557894,0.5846238782128378,-0.29126871871077176,0.7572169137862453,-0.9753287320770325,-0.156969159109312,-0.15522418456388623,0.3328881157704939,-0.8165820894934193,-0.4715709845795561,0.5255768980415447,0.8503431965219181,-0.02617961752803945,-0.42523051128305595,-0.9031984511895921,-0.05840864698546948,0.2970661228012974,-0.12410401236070143,-0.9467575786862121,-0.48428563789814116,0.23841775919884006,-0.8417983089934278],"angle1":"44.909703","angle2":"50.325742"}',
'{"num":20,"vertex":[-0.17703837629966873,0.005765846435861286,0.9841870596243658,-0.040437100332786205,0.8254369843222565,-0.563044070947963,-0.6629345406655351,-0.4816436812264798,0.5731816109464616,-0.22089018593810292,0.9009067212827172,0.37359684862677134,0.04043710876557668,-0.8254370018174715,0.5630440446938982,0.9464326823872362,0.21231380960214544,0.2432858893596685,-0.7190196599070582,0.6632140847989434,-0.20774457006487218,-0.7506553383440961,0.34681394440918684,0.5623492251073633,0.3626713972328899,0.5371999366891309,0.7615022558406094,0.7839134129603039,0.34169364508970623,-0.5183871274310713,-0.19577730094401471,-0.5591275989376466,-0.8056348903450613,0.8277652022420665,-0.5534468442257167,0.09220282302481855,0.5484152116632794,-0.2744951673160335,0.7898690769592536,-0.987639480118111,-0.11842492998843794,-0.10268297458323365,0.19864703677433773,-0.9611478853779822,-0.19166141295056793,0.49233008716517423,0.8703626315092814,0.008942871136881187,-0.5849490551671492,-0.7950300520626652,-0.16050488832523344,0.14256191399796747,0.18370996598739395,-0.9725876562419177,-0.6288008493930611,0.10011055187438989,-0.7710949158216321,0.6249678353389241,-0.41877496205728076,-0.6588191982218661],"angle1":"46.093313","angle2":"46.500260"}',
'{"num":21,"vertex":[-0.16236805456758213,-0.19018886643849103,0.9682276643118501,-0.017907125098770023,0.784504365342942,-0.619864691387213,-0.7050975975929402,-0.47640789843336656,0.52523603473007,-0.2128462845199473,0.9608212765352284,0.17753572520275426,0.054168864289149035,-0.8589803573434295,0.5091350310475388,0.9808805548579445,0.13757426750240306,0.13764685983613376,-0.7530823762704321,0.6177464199301295,-0.22639853182913441,-0.8631958252676115,0.25960342647382656,0.4330115797569571,0.489317684635202,0.508284500981239,0.7086713410075915,0.7147572468947466,0.4220582765485588,-0.5576637779238514,-0.2874657197765183,-0.5508570079331473,-0.7835304823453321,0.7608080623438028,-0.6279975296504997,0.16367710599084428,0.5701061695487409,-0.2419414608432628,0.7851390227007508,-0.9426484775493,-0.21609704886967535,-0.25439322562482686,0.23628169140215882,-0.9113021871013233,-0.3371932474004774,0.5221213860539248,0.8522128305442407,0.03350447255071771,-0.5014834140648818,-0.8600898275753472,-0.09359419810671787,0.19521647382101914,0.0250715252389867,-0.980439670235287,-0.5475342250530655,0.18996598799515954,-0.8149350868630959,0.7325649853374893,-0.36330819114917895,-0.5756350410645582,-0.2622252898767979,0.5385702020119497,0.8007371821352103],"angle1":"44.320496","angle2":"48.395618"}',
'{"num":22,"vertex":[-0.2983477849970147,-0.21455258914556716,0.9300299918165588,-0.042842008180355225,0.8144151169771902,-0.5786990405850904,-0.6808117258414319,-0.6298128553813735,0.3739400502128277,-0.08992604383422619,0.9802267354400525,0.1762635917280198,0.04284201284726745,-0.8144151210085623,0.5786990345661578,0.9598349896525828,0.19430511357853383,0.20239149062117012,-0.7389805994159986,0.6737069425219591,0.005160357011380775,-0.8601851414864444,0.13291814271793548,0.49235585677674254,0.47191130951571764,0.6327560077651531,0.6139377416222804,0.6895108961815855,0.26669859897190246,-0.6733844231590832,-0.48389193817513726,-0.4050076764009895,-0.7757688922774492,0.7408042981745244,-0.5106297619530691,0.4364243783450945,0.4188111703761442,-0.042334355393037794,0.9070859969824361,-0.9598349910362665,-0.19430511308566742,-0.20239148453227065,0.35834037212991987,-0.9258900206121504,-0.11966556494088933,0.603272780946162,0.7827192886972332,-0.15301132922362767,-0.3693414666588767,-0.8980711880615547,-0.23886193120708407,0.029933458390636315,0.16021587063168102,-0.9866280265969076,-0.6632653520586502,0.3577233297755719,-0.6573530954462695,0.8721657653852112,-0.3606664673692786,-0.33052469953907215,-0.2772748695249392,0.546784727153877,0.7900285494089363,0.27727486832606585,-0.5467847260849711,-0.7900285505695005],"angle1":"43.302006","angle2":"45.560118"}',
'{"num":23,"vertex":[-0.4660294927908633,-0.09568717981859426,0.8795797152432828,-0.07039996800443392,0.8424591361836615,-0.5341408506804676,-0.6286324223014138,-0.6777276001803958,0.38145324429761873,0.06616008554725421,0.9871259783332147,0.14561986808150076,0.06112327707326004,-0.5984042767246549,0.798859353451825,0.9393215048148683,0.1299617583903779,0.3174666154864359,-0.6316913204970678,0.7697472597329491,0.09195233407742509,-0.920740420517007,0.15112902617684054,0.3597180777678612,0.4896039852624819,0.6382865149555459,0.594035573380079,0.5410392323074592,0.3150640505733096,-0.779750725001583,-0.5157876437447103,-0.32495316237626093,-0.792697009469537,0.7314799924236794,-0.553024101713831,0.39887512282350235,0.3675562561682256,0.026617475884993393,0.9296203034191484,-0.9215507797458586,-0.34261969763626915,-0.18263598534087291,0.5389108475334026,-0.7764661776722298,-0.326611961418909,0.7061937721901042,0.6833444032784924,-0.18528567842084323,-0.2971562805662096,-0.8690766020800443,-0.3954794617133236,-0.17164375459193032,0.2751711688369788,-0.9459488619108731,-0.7941856196382646,0.36963240812489057,-0.4823288135946057,0.9207404187319569,-0.15112903683929507,-0.35971807785726784,-0.27207703568325453,0.5862928649404481,0.7630430939165458,0.2572213099077999,-0.40851798888447566,-0.875756958571897,0.07054405614139124,-0.9772262225864201,0.20013107213173256],"angle1":"41.481112","angle2":"43.027036"}',
'{"num":24,"vertex":[-0.6012274947325489,-0.12185613154708036,0.7897319689502276,-0.014272630139851042,0.870832317382496,-0.491372940882099,-0.5554029834363136,-0.7262060942750252,0.4051570493374825,0.06306431579189119,0.9621180877988106,0.265238905901945,0.04802793551627733,-0.5237904204387173,0.850492159203526,0.982346815624029,0.15062410753119268,0.11093742409016696,-0.6051931648556886,0.7907651096916618,-0.09182469442524265,-0.948591507675003,0.19641778939576113,0.2481817954156736,0.5644864176196687,0.5700247764114803,0.5970149400140291,0.5216476767331283,0.37916419869359985,-0.7642762666653793,-0.49000815965479294,-0.3865361056851278,-0.7813333747341774,0.7850522140181979,-0.5993220034334383,0.15654442649182787,0.05314569329829624,0.23264949081699457,0.9711074861756738,-0.9027669984298026,-0.40793218035264667,-0.1363931185169569,0.3737981342786147,-0.8082314740158227,-0.45501300994591054,0.6607837653535897,0.7341605438470018,-0.15611890117281316,-0.3225031774358089,-0.8962531311354974,-0.3045029153778731,-0.2278869924087453,0.3323473227140353,-0.9152118748004252,-0.8188075211089275,0.2522801101060833,-0.5156636398082723,0.8432107184026301,-0.20437223645695457,-0.4972199446286351,-0.44827639933576097,0.6247428217252672,0.6393314293082395,0.20629318004292477,-0.29851446247712976,-0.931843463012843,0.16833071184398873,-0.9446517270014441,0.28159880348340516,0.6647494476702408,-0.1784607066672556,0.725437763007919],"angle1":"42.065304","angle2":"42.065305"}',
'{"num":25,"vertex":[-0.6589665344175447,-0.1864469168454716,0.7286979166407359,0.11379632773071763,0.8452206526781513,-0.5221613199781492,-0.4826361078198504,-0.790709627998817,0.37661740748202044,-0.04024273957979292,0.970672236926102,0.23701462058697992,0.056930673152184426,-0.5687443066035692,0.8205417796556519,0.9701972886587586,0.1532258921912707,0.18772066226545864,-0.5576869403505855,0.8066504042861673,-0.19570488452607682,-0.8997821601413492,0.3222673896155499,0.29416966852778514,0.43905311990553125,0.5440270282253152,0.7150293353853051,0.3067619147912379,0.20307652644408658,-0.9298693736439637,-0.5972627893072984,-0.3469325946889281,-0.7231285744950712,0.8155725864944845,-0.5549602622450881,0.16389162116337677,-0.04268693080367556,0.1053453568512155,0.9935190897654922,-0.9167769240671895,-0.39927503635058026,-0.009975813006752224,0.3778217497395307,-0.8248557572798552,-0.4205516675820416,0.6061881302717834,0.7911233279839471,0.08160778539577891,-0.3453904557265346,-0.8800997211164681,-0.3257758646427509,-0.36189393888077404,0.3735392903852999,-0.85410840971144,-0.8902563577209315,0.21108155491169472,-0.40359409648001787,0.8074922964324286,-0.27099176644740564,-0.5239462317070307,-0.40460467926904786,0.6106885063824234,0.6807015511117892,0.06565049663984092,-0.42955221097339996,-0.9006524914409586,0.2248559041095997,-0.9401981620191769,0.2558656649939883,0.642090002226051,-0.17121069401792563,0.7472665704387225,0.7710915028395829,0.4263483575873147,-0.47291116737839106],"angle1":"39.610448","angle2":"43.902209"}',
'{"num":26,"vertex":[-0.7040224011973247,-0.1385233912926147,0.6965369542796319,0.15353278205647783,0.8726847840282556,-0.46351801751340244,-0.45912334571286284,-0.752176971463177,0.47268970479788325,-0.05741899589000904,0.9855080984706887,0.15961468215571695,0.06757480877593407,-0.5199985313534471,0.8514899721130917,0.9918283295174407,0.03383116816685062,0.12301226291353813,-0.5843555808437948,0.7735629580049957,-0.24521195961712897,-0.9444429541899207,0.2796609621406194,0.1726767284135252,0.17500743035023655,0.6628834864686616,0.7279820620656521,0.33142449621078035,0.3405946627365635,-0.8798596928072095,-0.5532640241622511,-0.44237747891570167,-0.7058336105031978,0.7681769412919393,-0.6289266468203918,-0.1198142720489458,-0.1207511975991647,0.10316578767080573,0.9873074336459894,-0.9020911720028524,-0.4315387380915864,-0.002415558080719778,0.23059568867781294,-0.7995573482754247,-0.5545571883782379,0.6525580808197385,0.7245581659799573,0.22177334210544858,-0.3747015204436298,-0.9000194714996269,-0.22262911197497148,-0.3535085823788999,0.4001535159217948,-0.8455228239851875,-0.8612472298319143,0.12352209252395213,-0.4929457391694933,0.7381968742653258,-0.20727752516881529,-0.6419512461120345,-0.5308653424831963,0.6180976364687054,0.579773490202854,0.03605622210431273,-0.2709872237980635,-0.9619074141443047,0.20177450284553705,-0.9561155957169266,0.2124382678057385,0.6297971642274873,0.14730319548140589,0.7626646055324595,0.7940255784320577,0.4740538932609679,-0.38052107310864547,0.6743866006007905,-0.4937793061575862,0.5489851634977423],"angle1":"38.842166","angle2":"42.470719"}',
'{"num":27,"vertex":[-0.6602626584522931,-0.21262475252358676,0.7203082232404362,0.41361934458441135,0.8021599057446527,-0.4306489561130875,-0.4136193418768629,-0.8021599048320208,0.43064896041350664,-0.036643439197102105,0.9968020754681822,0.0710132431743022,0.042950159332309536,-0.49647810528789477,0.8669860291740987,0.9583441412268684,0.09743282453993206,0.26848342905718964,-0.6580060295077317,0.7498760170238126,-0.06865875198379837,-0.9549220725912783,0.17404670055909158,0.24048197708450256,0.15399505357098464,0.72717774004201,0.6689529563901071,0.307911841152367,0.2954961987638321,-0.9043629219479785,-0.6524172454942057,-0.4416699249628176,-0.6158566514742637,0.8640377569779768,-0.49494090086982917,-0.09204487580864297,-0.14292100234288485,0.15134842817935018,0.9780936766879464,-0.8819251980207075,-0.47062460604518347,0.02684073920278032,0.3465421090788815,-0.8449019947708396,-0.407491332260475,0.6665693706113998,0.7129487238837476,0.21769104546411233,-0.31570736988626746,-0.9139306338640636,-0.25506793817398254,-0.2583059818139538,0.7388022252955971,-0.622454248645957,-0.8677041264861908,0.20408039197157496,-0.4532557142403889,0.6434581389461259,-0.269072676131015,-0.7166320662541427,-0.5303383218009781,0.5967508303323188,0.6021874383670008,-0.005932321090597309,-0.4706222067722033,-0.8823148792009232,0.25589703067832464,-0.9299089773949002,0.2641704060836253,0.539937010056191,0.16473188604401368,0.8254280288989241,0.8795162490377033,0.2795178520257296,-0.3851245747515616,0.6614281048630603,-0.4783965063475318,0.5776241380099489,-0.355501203405586,0.13415939215661324,-0.9249973793872868],"angle1":"39.940290","angle2":"41.074451"}',
'{"num":28,"vertex":[-0.6075977189805237,-0.31398427308994664,0.7295470431314504,0.5033526498963286,0.7962359731208883,-0.3356253639857634,-0.3149704492539255,-0.8408792558760674,0.4401314498352642,-0.027148521748785303,0.9988986896534676,0.03826702987483178,0.07069885185068966,-0.44282158698104723,0.8938180544442931,0.9433425149326814,0.0861883780451675,0.32043168228255325,-0.6708532616128836,0.727058350086627,-0.14608920888507712,-0.872270763707473,0.20442592379714938,0.4442451535592298,0.1685278157276599,0.7232322181439544,0.6697264620459903,0.41921552162645304,0.3586275546809624,-0.83405312987304,-0.6843594816941732,-0.4058966696139998,-0.6057227033978055,0.874230523912403,-0.4724723040812811,-0.11176275290082475,-0.23417803881091925,0.2100331059135819,0.9492348184506116,-0.8453435469842426,-0.5268725118061932,0.08831559248021921,0.37207641958124926,-0.8513459513765976,-0.369823213260436,0.6816141505582891,0.6775771879122143,0.2762088053985206,-0.32865260863739015,-0.9145800543124243,-0.23564971268754312,-0.13930821504077923,0.7602177304188245,-0.6345567142336479,-0.9796683774693974,0.08185994647653808,-0.18316336792420254,0.5899791734537897,-0.29435173774519074,-0.7518521326545332,-0.479756391753044,0.7165530149347074,0.5063453182958059,-0.060847842896568305,-0.5884392814834989,-0.8062485671441645,0.30711147878676903,-0.9118878403703247,0.272292317523189,0.4809822147009736,0.15131062142936927,0.8635746667104152,0.9139529118654135,0.20947636434159816,-0.3475769377777498,0.6706569612390617,-0.468677989457068,0.5749436342286677,-0.1164548643403064,0.029884736837511895,-0.9927462752766354,-0.634331103372062,0.3006296621579669,-0.7122119470533818],"angle1":"37.823744","angle2":"39.749232"}',
'{"num":29,"vertex":[-0.6179565550511792,-0.3012148203929555,0.7262226435776555,0.4110015614180656,0.8661683330935271,-0.2843064108631614,-0.31096293693774346,-0.828001783950532,0.46659950452801535,-0.10267931730953554,0.9934387852172638,0.05036206730164086,0.026078776446927274,-0.4095357127861063,0.9119212670904254,0.9403499998362818,0.040733598474384555,0.3377612348438351,-0.691175550038205,0.7038064271328578,-0.16411237660781677,-0.8768865515432237,0.19053718801951658,0.44132250758855335,0.12693028400623224,0.741186845235518,0.6591894746216125,0.44831258251110945,0.4046801747657777,-0.797025585858923,-0.7166782681924757,-0.41153269092618233,-0.5630391675538116,0.8116343789726985,-0.5827766729590723,0.04026144960575345,-0.23666164435805281,0.2277384956151442,0.9445244537356846,-0.8288061904328958,-0.5498467179552863,0.10367683180879991,0.36798080163988045,-0.8271119782398337,-0.424824557996192,0.6597846779474575,0.671207327647022,0.3378829709510571,-0.30987875917188296,-0.9259261441823962,-0.21595353697870903,-0.16331164164610024,0.7453939744065049,-0.6463103980451887,-0.9847979062337726,0.06535936295142643,-0.16093861423586753,0.42362299954022864,-0.27945933375641807,-0.8616530827641472,-0.51488361713191,0.6959936204669571,0.5004875034188747,-0.16145684052731613,-0.5836012919066436,-0.7958273812403249,0.26752603146107923,-0.9305464041477325,0.25002642304046674,0.47319036805407483,0.1805320937095307,0.8622639031768073,0.8768865867557837,-0.19053710886082714,-0.4413224717989658,0.5944630119807585,-0.46596023482848836,0.6553585178704437,-0.1340317470075531,0.08696906978732741,-0.9871534185193456,-0.6599752616446968,0.2702076906263012,-0.7010138785669048,0.8823807289341206,0.40209790750726804,-0.24437987229713987],"angle1":"36.391328","angle2":"40.335672"}',
'{"num":30,"vertex":[-0.6395441699643595,-0.18327669147910142,0.7465875092881428,0.4856777532431334,0.839245659193342,-0.24450734862133433,-0.3339966385947071,-0.7871669231947948,0.5184732205577031,-0.06993647872634326,0.988208988939551,0.13620529770324677,0.02118079366823662,-0.42782316805810633,0.9036142489205826,0.9240361749734558,0.05314950301407845,0.3785924955275545,-0.675911734701556,0.7352242711853998,-0.05087826601439156,-0.9345123951187484,0.19787826551248136,0.2958560045143447,0.13433591366508926,0.723314405491867,0.6773257215754563,0.5446333707070754,0.4025880450172362,-0.7357291332558805,-0.6854161967865785,-0.6045302962433456,-0.4058913131696159,0.865296245456697,-0.5006549338619846,0.024638279124066777,-0.18156501972275013,0.20177316901602055,0.9624560934807934,-0.8396004736342341,-0.5038630892672364,0.20296066601005813,0.4405937664386989,-0.8160191790623382,-0.37415215137399493,0.6666348034306748,0.663980208777295,0.3387156937713471,-0.22952754405948195,-0.9684191878940969,-0.09737239360599355,-0.10739618944526276,0.8527385966920299,-0.5111779965964351,-0.9519983017444681,-0.004589417768544125,-0.30606889864897147,0.2641829797310384,-0.23156753243706377,-0.9362605572923807,-0.5283727370346076,0.6163354380969981,0.583911704373477,-0.0906747832537534,-0.7030312560122303,-0.7053546177290899,0.3052539062602783,-0.9074142653337708,0.2888241745104009,0.4778059598094629,0.16405159419571752,0.8630113204427862,0.7828316869976613,-0.24995686109592458,-0.5698211275685277,0.5989883883002574,-0.4715322326956422,0.6472018728422554,-0.05705498297598133,0.3496076072452708,-0.9351573396353401,-0.6426497266590856,0.45124902287781793,-0.6191733587427816,0.9345115857313714,0.28455185010903694,-0.213818476127209,-0.47780595729996506,-0.16405159085184515,-0.8630113224678126],"angle1":"36.942383","angle2":"39.017031"}',
'{"num":31,"vertex":[-0.6852025363451085,-0.08378600647145328,0.7235173731886441,0.49147137509767014,0.8349095521462044,-0.24775376323000523,-0.5051468136808798,-0.7325643597677965,0.45626325232923687,0.0038183029534542973,0.9872407449098876,0.1591889825092361,-0.06001943720301228,-0.39439275720765576,0.9169798363213757,0.9082010108069067,0.0830752006489192,0.4102065760156153,-0.5723137895557084,0.8186323389211208,-0.04793766741216737,-0.9355968951338813,0.3151959632392238,0.1590910260622476,0.1312732352434226,0.7008946099387962,0.7010806540387974,0.4588478265580436,0.44430639701127994,-0.7694481773568735,-0.6504839154655278,-0.7121256120897926,-0.26409806573766215,0.9360058491439655,-0.34755362996050315,-0.05567337487131336,-0.18973753026243162,0.21482194375386593,0.9580455114929163,-0.9185165554817651,-0.33884513169613983,0.20374325518097247,0.4720806657555216,-0.7000062829516935,-0.5358461055638803,0.6554029972434794,0.6635170133895272,0.3608214020078433,-0.08678881411014547,-0.9921835740327932,-0.08966302005212363,-0.09782664521803355,0.8450078806834209,-0.525729615932276,-0.9179393699424885,-0.09621186170232235,-0.3848773710902738,0.19405545503125984,-0.20670425411370622,-0.9589660221842623,-0.5342486809657588,0.6201077211027273,0.5744952228827747,-0.14591844691191697,-0.7177590929663475,-0.6808301486530544,0.5556837438769124,-0.8283450344310681,0.07113424438574424,0.45571049393778934,0.12827100580344666,0.8808373827132612,0.7570238107067492,-0.12193130253121656,-0.6419094231167455,0.6180573825776872,-0.45669871927585387,0.639868229913795,-0.16501793203656018,0.3361623238009895,-0.9272345842143163,-0.6898781139510521,0.4602265856986521,-0.5588020022400602,0.915636035183522,0.3414940258772257,-0.21211431201963935,-0.5022186010657382,-0.21594980495217334,-0.8373423185798573,0.10505637015170291,-0.8473820099956872,0.5204871643241716],"angle1":"36.373117","angle2":"38.122385"}',
'{"num":32,"vertex":[-0.7520712304244224,0.11016963685036742,0.6498088299524359,0.49027786901586484,0.8313376378417066,-0.2617352537604248,-0.49027786678645513,-0.8313376381146153,0.26173525706968875,0.027973295452543036,0.9877368039685348,0.15360176049625507,0.1572877412728612,-0.33863796059915063,0.9276771518618584,0.9251017149274835,0.10706837776429039,0.3643119261308257,-0.5462720143561821,0.8332543215660688,-0.0852884630105924,-0.9326673994943108,0.3508256790982844,0.08398133605598074,0.12268145695355874,0.6901364475674248,0.7132046998294159,0.4551501718291697,0.4445563036332301,-0.7714972546832791,-0.6451697342261076,-0.6831239314134668,-0.3421954242371205,0.9326673992470836,-0.3508256782219355,-0.08398134246247939,-0.19803240801011404,0.19365570310127908,0.9608749315254639,-0.9091795627103715,-0.34741991980823744,0.22954721098330882,0.4931542901061976,-0.6852288033569556,-0.5359667276985083,0.6451697330272135,0.6831239343723305,0.3421954205907227,-0.02797329677275571,-0.987736803327602,-0.1536017643773442,-0.08946525156233397,0.8402938995343596,-0.5346981682858356,-0.9251017147940894,-0.10706837406129252,-0.36431192755783665,0.19803241588906878,-0.19365571079944482,-0.9608749283501473,-0.4931542888482818,0.6852288069723864,0.5359667242336464,-0.12268145535299167,-0.690136448562639,-0.7132046991417118,0.546272015778302,-0.8332543208305812,0.08528846108751978,0.5054905184232016,0.19235482018704048,0.8411176843552004,0.7520712294821957,-0.11016963662704904,-0.6498088310808053,0.6831738493665622,-0.4466611748101882,0.5777259613855485,-0.15728774534935028,0.33863795855862083,-0.9276771519155613,-0.6831738554554597,0.44666117245827835,-0.577725956003639,0.9091795613290412,0.34741992002097755,-0.22954721613243284,-0.5054905224267653,-0.1923548205378842,-0.841117681868925,0.089465250114389,-0.8402938941413063,0.5346981770034467,-0.4551501625295671,-0.4445563065133722,0.7714972585100334],"angle1":"37.377367","angle2":"37.377368"}',
];
