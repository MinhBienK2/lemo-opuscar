// timeline.js — sinh tự động từ voice/lines.json bằng mk_timeline.py của kênh
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['c1', 2.4],
  ['c2', 0.3],
  ['c3', 0.3],
  ['c4', 0.3],
  ['c5', 0.3],
  ['c6', 1.2],
  ['c7', 0.3],
  ['c8', 0.3],
  ['c9', 0.3],
  ['c10', 0.6],
  ['c11', 0.3],
  ['c12', 0.3],
  ['c13', 0.3],
  ['c14', 0.3],
  ['c15', 0.3],
  ['c16', 0.3],
  ['c17', 0.3],
  ['c18', 0.3],
  ['c19', 0.6],
  ['c20', 0.3],
  ['c21', 0.3],
  ['c22', 0.3],
  ['c23', 0.3],
  ['c24', 0.3],
  ['c25', 0.3],
  ['c26', 0.3],
  ['c27', 0.3],
  ['c28', 0.3],
  ['c29', 0.6],
  ['c30', 0.3],
  ['c31', 0.3],
  ['c32', 0.3],
  ['c33', 0.3],
  ['c34', 0.3],
  ['c35', 0.3],
  ['c36', 0.3],
  ['c37', 0.3],
  ['c38', 0.3],
  ['c39', 1.2],
  ['c40', 0.3],
  ['c41', 0.3],
  ['c42', 0.3],
  ['c43', 0.3],
  ['c44', 0.3],
  ['c45', 0.3],
  ['c46', 0.3],
  ['c47', 0.3],
  ['c48', 0.3],
  ['c49', 0.3],
  ['c50', 0.3],
  ['c51', 0.3],
  ['c52', 0.3],
  ['c53', 0.3],
  ['c54', 0.3],
  ['c55', 0.3],
  ['c56', 0.3],
  ['c57', 0.3],
  ['c58', 0.3],
  ['c59', 0.6],
  ['c60', 0.3],
  ['c61', 0.3],
  ['c62', 0.3],
  ['c63', 0.3],
  ['c64', 0.6],
  ['c65', 0.3],
  ['c66', 0.3],
  ['c67', 0.3],
  ['c68', 0.3],
  ['c69', 0.3],
  ['c70', 0.3],
  ['c71', 0.6],
  ['c72', 0.3],
  ['c73', 0.3],
  ['c74', 0.6],
  ['c75', 0.3],
  ['c76', 0.3],
  ['c77', 0.3],
  ['c78', 0.3],
  ['c79', 1.2],
  ['c80', 0.3],
  ['c81', 0.3],
  ['c82', 0.3],
  ['c83', 0.3],
  ['c84', 0.3],
  ['c85', 0.3],
  ['c86', 0.3],
  ['c87', 0.6],
  ['c88', 0.3],
  ['c89', 0.3],
  ['c90', 0.3],
  ['c91', 0.3],
  ['c92', 0.3],
  ['c93', 0.3],
  ['c94', 0.3],
  ['c95', 0.3],
  ['c96', 0.3],
  ['c97', 0.3],
  ['c98', 0.3],
  ['c99', 0.6],
  ['c100', 0.3],
  ['c101', 0.3],
  ['c102', 0.3],
  ['c103', 0.3],
  ['c104', 0.3],
  ['c105', 0.3],
  ['c106', 0.3],
  ['c107', 1.2],
  ['c108', 0.6],
  ['c109', 0.3],
  ['c110', 0.3],
  ['c111', 0.3],
  ['c112', 0.3],
  ['c113', 0.3],
  ['c114', 0.3],
  ['c115', 0.3],
  ['c116', 0.6],
  ['c117', 0.3],
  ['c118', 0.6],
  ['c119', 1.2],
  ['c120', 0.6],
  ['c121', 0.3],
  ['c122', 0.3],
  ['c123', 0.6],
  ['c124', 0.3],
  ['c125', 0.3],
  ['c126', 0.3],
  ['c127', 0.3],
  ['c128', 0.6],
  ['c129', 0.3],
  ['c130', 0.3],
  ['c131', 1.2],
  ['c132', 0.3],
  ['c133', 0.6],
  ['c134', 0.3],
  ['c135', 0.3],
  ['c136', 0.6],
  ['c137', 0.3],
  ['c138', 0.3],
  ['c139', 1.2],
  ['c140', 0.3],
  ['c141', 0.6],
  ['c142', 0.3],
  ['c143', 0.3],
  ['c144', 0.6],
  ['c145', 0.3],
  ['c146', 0.6],
  ['c147', 0.3],
  ['c148', 0.3],
  ['c149', 0.6],
  ['c150', 0.3],
  ['c151', 0.3],
  ['c152', 0.3],
  ['c153', 0.3],
  ['c154', 0.3],
  ['c155', 0.6],
  ['c156', 0.3],
  ['c157', 0.3],
  ['c158', 0.3],
  ['c159', 0.3],
  ['c160', 0.3],
  ['c161', 0.3],
  ['c162', 0.6],
  ['c163', 0.3],
  ['c164', 0.3],
  ['c165', 0.6],
  ['c166', 0.3],
  ['c167', 0.3],
  ['c168', 0.3],
  ['c169', 0.3],
  ['c170', 0.3],
  ['c171', 0.3],
  ['c172', 0.3],
  ['c173', 0.3],
  ['c174', 0.3],
  ['c175', 0.6],
  ['c176', 0.3],
  ['c177', 0.3],
  ['c178', 0.3],
  ['c179', 0.3],
  ['c180', 0.6],
  ['c181', 0.3],
  ['c182', 0.3],
  ['c183', 0.3],
  ['c184', 0.3],
  ['c185', 0.3],
];

export const SUBS = {
  c1: [
    'Mười ba giờ. Mí mắt nặng trĩu,',
    'và cơ thể bạn bắt đầu nặng nề.',
  ],
  c2: [
    'Buổi chiều, bạn úp mặt xuống hai cánh tay trên mặt',
    'bàn, ngủ lấy một chút cho đỡ mệt,',
    'chừng ba mươi phút.',
  ],
  c3: [
    'Rồi bạn ngẩng đầu lên, tỉnh dậy giữa chừng,',
    'và cái mệt ấy vẫn còn nguyên,',
    'nặng hơn lúc mới nằm xuống.',
  ],
  c4: [
    'Chỉ ngủ ba mươi phút, mà cái mệt không giảm,',
    'lại nặng hơn lúc vừa nằm xuống.',
    'Đó mới là chỗ kỳ lạ của một buổi chiều bình thường.',
  ],
  c5: [
    'Trên tường, đồng hồ mới chỉ tới một giờ ba mươi',
    'phút: bạn mới ngủ vừa ba mươi phút thôi.',
  ],
  c6: [
    'Bạn có bao giờ tự hỏi vì sao không:',
    'nằm xuống chỉ để ngủ một lúc,',
    'dậy lên lại vẫn thấy mệt?',
  ],
  c7: [
    'Ta cứ nghĩ rằng ngủ là để lấy lại sức,',
    'và đồng hồ trên tường sẽ báo bạn đã nghỉ ngơi xong.',
  ],
  c8: [
    'Nhưng nằm xuống ba mươi phút rồi bỗng nhiên tỉnh dậy',
    'giữa chừng, thì cơ thể mang một kiểu mệt rất riêng.',
  ],
  c9: [
    'Người ta gọi cái cảm giác mệt và lười buồn ngủ ngay',
    'lúc vừa mở mắt ấy là cơn lười sau khi ngủ.',
  ],
  c10: [
    'Nó không phải cơn buồn ngủ thường ngày,',
    'mà là trạng thái lơ đãng lúc não chưa kịp chạy lại.',
  ],
  c11: [
    'Mí mắt đã mở ra, tay với lấy cốc nước bên cạnh,',
    'nhưng bộ não thì chưa quay lại hẳn được đâu.',
  ],
  c12: [
    'Nhưng với bộ não bên trong bạn,',
    'ba mươi phút ấy không hề trống rỗng,',
    'ngược lại là lúc rất nhiều việc xảy ra.',
  ],
  c13: [
    'Ba mươi phút ngủ trên bàn,',
    'mà cơ thể bạn không hề nhẹ đi,',
    'cũng chẳng tỉnh hơn được chút nào cả.',
  ],
  c14: [
    'Vì bộ não bên trong bạn không chạy theo cái đồng hồ',
    'trên tường kia, mà có nhịp riêng.',
  ],
  c15: [
    'Đồng hồ trên tường chỉ đếm phút trôi qua,',
    'còn bên trong não thì đếm con đường đi từ thức sang ngủ.',
  ],
  c16: [
    'Ba mươi phút trôi qua trên tường,',
    'còn bên trong não thì đi được một đoạn không hề ngắn.',
  ],
  c17: [
    'Bạn tưởng mình chỉ ngủ một chút thôi,',
    'nhưng trong não, cái nhịp ấy đã chạy khá xa.',
  ],
  c18: [
    'Vấn đề không nằm ở chỗ bạn ngủ quá ít,',
    'mà nằm ở chỗ bạn đã ngủ quá sâu một chút rồi.',
  ],
  c19: [
    'Để hiểu vì sao,',
    'ta phải đi vào ngay bên trong cái đầu của bạn.',
  ],
  c20: [
    'Ở đó có rất nhiều tế bào thần kinh:',
    'mỗi tế bào có một khối thân,',
    'từ khối thân mọc ra những nhánh nhỏ,',
    'và một sợi dây kéo dài đi.',
  ],
  c21: [
    'Giữa đầu sợi của một tế bào và một nhánh của tế bào',
    'bên kia có một khe nhỏ hẹp đến mức gần như không',
    'thấy, và tín hiệu phải chui qua.',
  ],
  c22: [
    'Ở đó có rất nhiều tế bào thần kinh:',
    'mỗi tế bào có một khối thân,',
    'từ khối thân mọc ra những nhánh nhỏ,',
    'và một sợi dây kéo dài đi.',
  ],
  c23: [
    'Bên trong khe ấy,',
    'có một thứ gì đó đang tích tụ suốt buổi sáng,',
    'mỗi phút lại dày thêm một chút nữa.',
  ],
  c24: [
    'Tín hiệu từ tế bào này sang tế bào kia phải chui qua',
    'khe ấy, và trong khe luôn có một lớp nước rất mỏng.',
  ],
  c25: [
    'Khe ấy không trống suốt ngày,',
    'từ lúc bạn thức dậy buổi sáng nó đã lấp đầy dần từng',
    'chút một.',
  ],
  c26: [
    'Chính thứ nằm trong khe ấy là thứ khiến bạn buồn',
    'ngủ, và cho đến giờ bạn không biết tên của nó.',
  ],
  c27: [
    'Khi thứ trong khe ấy dày lên dần theo từng giờ thức,',
    'cảm giác đó được gọi bằng cái tên áp lực ngủ.',
  ],
  c28: [
    'Trong khe ấy có một thứ đang tích tụ từ sáng tới',
    'trưa, và chính nó khiến ta buồn ngủ.',
  ],
  c29: [
    'Ba mươi phút ngủ trưa ấy có khoảng mười lăm phút là',
    'giấc ngủ sâu thật.',
    'Con số đó đo ở nhóm người trẻ thiếu ngủ trong phòng',
    'thí nghiệm.',
  ],
  c30: [
    'Bây giờ, ta xem khoảnh khắc bạn vừa chìm vào giấc:',
    'cơ thể buông lỏng hẳn ra.',
  ],
  c31: [
    'Lý do thứ nhất, ta nói trước để rồi kiểm chứng:',
    'dậy đúng giữa lúc não đang sâu nhất,',
    'thì tỉnh dậy khó hơn hẳn nhiều lắm.',
  ],
  c32: [
    'Lý do thứ hai nằm ở một chiếc đồng hồ khác,',
    'cái đồng hồ đang chạy đều đặn bên trong não bạn đấy.',
  ],
  c33: [
    'Chiếc đồng hồ ấy không đếm phút,',
    'nó đo nhịp lên xuống của cơ thể trong suốt một ngày,',
    'nhịp sinh học.',
  ],
  c34: [
    'Và buổi chiều tới, chiếc đồng hồ ấy rơi xuống đáy,',
    'tức là lúc thấp nhất trong suốt cả một ngày dài.',
  ],
  c35: [
    'Giấc ngủ trưa của bạn rơi vào vùng thấp của buổi',
    'chiều, lúc cơ thể đang đòi ngủ nhất trong ngày đó.',
  ],
  c36: [
    'Hai chuyện đó cộng lại với nhau,',
    'và bạn dậy lúc não còn chưa kịp tỉnh hẳn một cách',
    'bình thường lắm.',
  ],
  c37: [
    'Câu trả lời nằm ở bên trong,',
    'ở cái khe nho giữa hai tế bào thần kinh.',
  ],
  c38: [
    'Vậy thì cùng đi vào đó thôi.',
  ],
  c39: [
    'Máy quay đi qua lớp vỏ não,',
    'rồi hạ xuống một mặt cắt.',
  ],
  c40: [
    'Bên trong mặt cắt ấy,',
    'ta thấy đúng cái khe ấy — và bây giờ nó không còn trống nữa.',
  ],
  c41: [
    'Trong khe là nước,',
    'một lớp chất lỏng rất mỏng và trong suốt,',
    'chảy chậm giữa hai bức tường của tế bào.',
  ],
  c42: [
    'Bên trong mặt cắt ấy,',
    'ta thấy đúng cái khe ấy — và bây giờ nó không còn trống nữa.',
  ],
  c43: [
    'Phân tử đã tụ lại thành một lớp dày,',
    'và mặt nước trong khe dâng gần tới miệng khe.',
  ],
  c44: [
    'Chúng trôi chậm giữa hai bức tường,',
    'không thoát ra ngoài được.',
  ],
  c45: [
    'Cặp tế bào thần kinh ấy vẫn đang gửi tín hiệu qua',
    'khe, ngày này qua ngày khác.',
  ],
  c46: [
    'Chúng tụ lại đều đặn, từng phân tử một,',
    'như từng giọt nước rơi xuống đáy.',
  ],
  c47: [
    'Phân tử đó có tên là adenosin. Nó nhỏ lắm,',
    'và cứ tích lại trong khe synapse suốt những giờ bạn thức.',
  ],
  c48: [
    'Cặp tế bào thần kinh ấy vẫn đang gửi tín hiệu qua',
    'khe, ngày này qua ngày khác.',
  ],
  c49: [
    'Hết cái khe này lại là một khe nữa, khắp não bạn.',
  ],
  c50: [
    'Mỗi phút bạn thức,',
    'lại thêm một ít adenosin tụ lại trong khe,',
    'đều đặn như từng giọt nước rơi xuống đáy.',
  ],
  c51: [
    'Đến giữa trưa, phân tử trong khe đã dày lên,',
    'và mặt nước trong khe dâng gần tới miệng khe.',
  ],
  c52: [
    'Adenosin bám vào các ô cửa nhỏ trên mặt tế bào,',
    'rồi gửi một tín hiệu đi vào sâu bên trong tế bào.',
  ],
  c53: [
    'Tín hiệu đó chạy vào sâu bên trong tế bào thần kinh,',
    'và thứ nhìn thấy được là mí mắt bạn nặng xuống.',
  ],
  c54: [
    'Đó là lý do buổi sáng đến trưa,',
    'cảm giác buồn ngủ cứ dày lên.',
    'Tên của nó là áp lực ngủ.',
  ],
  c55: [
    'Bạn càng thức lâu, áp lực ngủ càng dày lên,',
    'như nước dâng dần trong chính cái khe hẹp này,',
    'không còn trống.',
  ],
  c56: [
    'Tín hiệu buồn ngủ lặp đi lặp lại,',
    'càng lúc càng mạnh,',
    'và mí mắt bạn nặng trĩu trước giữa trưa rõ ràng.',
  ],
  c57: [
    'Bạn không nhận ra áp lực ngủ đang lớn dần từng chút.',
    'Nó chỉ lộ ra khi bạn vô tình ngáp dài.',
  ],
  c58: [
    'Tới lúc một giờ chiều,',
    'khe synapse đã dày lên adenosin tích tụ từ sáng,',
    'và áp lực ngủ đã dày lên rõ rệt.',
  ],
  c59: [
    'Áp lực ngủ lúc này đủ cao,',
    'đủ để bạn úp mặt xuống bàn và rơi vào giấc ngủ trong',
    'chính cái buổi chiều ấy.',
  ],
  c60: [
    'Nhưng có một cách tạm thời để đẩy cảm giác buồn ngủ',
    'ấy ra xa, mà không cần ngủ một giấc nào.',
  ],
  c61: [
    'Đây là cửa chặn adenosin:',
    'chỗ mà phân tử buồn ngủ phải bám vào mới gửi được',
    'tín hiệu đi vào trong.',
  ],
  c62: [
    'Phân tử cà phê trôi tới và ngồi chặn lên ô cửa ấy.',
    'Adenosin tới mà không còn chỗ để bám vào.',
  ],
  c63: [
    'Nên tín hiệu buồn ngủ không đi qua được nữa.',
    'Adenosin vẫn nằm đó, ngay trong khe,',
    'không hề biến mất đi.',
  ],
  c64: [
    'Cà phê không tạo ra năng lượng cho bạn.',
    'Nó chỉ làm bạn không cảm thấy cả cái buồn ngủ ấy nữa.',
  ],
  c65: [
    'Trên bàn làm việc, tách cà phê vẫn còn nóng,',
    'hơi nước bốc lên. Bạn uống một ngụm,',
    'và bạn vẫn chưa thấy tỉnh thêm chút nào.',
  ],
  c66: [
    'Nhưng phân tử cà phê phải đi từ chiếc tách lên máu,',
    'rồi lên não. Chỉ sau khoảng ba mươi phút mới tới nơi.',
  ],
  c67: [
    'Trên bàn làm việc,',
    'một chiếc đồng hồ nhỏ cạnh tách cà phê bắt đầu chạy,',
    'kim tiến đều từng phút một.',
  ],
  c68: [
    'Trong khe, các phân tử cà phê lần lượt tới và ngồi',
    'chặn cửa. Mỗi phân tử chặn trọn một ô cửa.',
  ],
  c69: [
    'Adenosin vẫn nằm đó, không ai kéo đi.',
    'Cà phê chỉ đứng trước cửa chứ không dọn khe sạch.',
  ],
  c70: [
    'Đó là lý do ta tưởng mình tỉnh. Cửa bị chặn,',
    'tín hiệu không vào,',
    'và buồn ngủ biến mất khỏi tầm mắt,',
    'dù nó vẫn nằm trong khe.',
  ],
  c71: [
    'Trong lúc bạn ngủ,',
    'lượng adenosin trong khe bị dọn dần đi,',
    'và khe trống dần.',
  ],
  c72: [
    'Bạn không thấy ai lấy chúng đi.',
    'Bạn chỉ thấy khe trống dần,',
    'mặt nước trong khe hạ xuống từng chút một.',
  ],
  c73: [
    'Khe càng trống, áp lực ngủ càng giảm dần.',
    'Cơ thể được nghỉ ngơi thật sự.',
  ],
  c74: [
    'Và giấc ngủ trưa vừa rồi của bạn đã tiêu mất một',
    'phần áp lực ngủ dồn lên từ cả buổi sáng.',
  ],
  c75: [
    'Tối đến, áp lực ngủ đã bị bớt đi rồi,',
    'nên tối hôm đó bạn sẽ ngủ ít hơn,',
    'dù trong ngày bạn đã ngủ một giấc.',
  ],
  c76: [
    'Còn một điều nữa không nằm ở chỗ này: lúc bạn dậy,',
    'não bạn còn đang ở giữa một giấc ngủ sâu.',
  ],
  c77: [
    'Cà phê chỉ chặn được phân tử buồn ngủ ngay tại cửa,',
    'chứ không lấy chúng đi;',
    'nên áp lực ngủ vẫn còn nguyên trong khe.',
  ],
  c78: [
    'Muốn giảm áp lực ngủ, cà phê không làm được.',
    'Chỉ có giấc ngủ thật mới rút được nó ra khỏi khe.',
  ],
  c79: [
    'Trong lúc bạn nằm đó,',
    'bên trong não có một việc đang diễn ra mà mắt thường',
    'không thấy.',
  ],
  c80: [
    'Bên trong não,',
    'quanh mỗi mạch máu có sẵn một kênh chất lỏng hẹp,',
    'chạy song song ngay bên bờ mạch.',
  ],
  c81: [
    'Lúc bạn còn thức, kênh đó chỉ chảy yếu,',
    'chất lỏng lót mỏng quanh thành mạch,',
    'đường đi hẹp hơn nhiều.',
  ],
  c82: [
    'Chỉ khi bạn chìm vào giấc ngủ,',
    'kênh ấy mới chảy mạnh hẳn lên.',
  ],
  c83: [
    'Dòng ấy không chảy tùy tiện,',
    'nó đi sát theo mạch máu, ôm lấy từng mạch một,',
    'cuộn dọc bên thành mạch.',
  ],
  c84: [
    'Dòng ấy cứ trôi suốt lúc bạn ngủ, chạy giữa não bạn.',
  ],
  c85: [
    'Máy quay bám theo dòng chất lỏng,',
    'luồn vào kênh chất lỏng hẹp chạy song song với mạch',
    'máu sâu bên trong não bạn.',
  ],
  c86: [
    'Trước khi đi tiếp, một chuyện phải nói rõ:',
    'lúc ngủ sâu, não bận làm việc gì bên trong.',
  ],
  c87: [
    'Và khi bạn rơi vào giấc ngủ sâu,',
    'dòng ấy chảy mạnh hơn hẳn so với lúc bạn còn thức.',
  ],
  c88: [
    'Trong dòng đó trôi những mảnh chất thải do não tạo',
    'ra suốt cả ngày làm việc, gọi là chất cặn bã.',
  ],
  c89: [
    'Những mảnh chất thải ấy bám lơ lửng quanh thành mạch',
    'máu, chưa tìm được một đường nào để trôi ra ngoài não.',
  ],
  c90: [
    'Đến khi dòng chất lỏng chảy qua,',
    'các hạt rác ấy bị cuốn đi,',
    'trôi cùng dòng ra khỏi mô não của bạn rồi.',
  ],
  c91: [
    'Chúng trôi dọc kênh chất lỏng,',
    'đi xa dần ra ngoài não,',
    'đến lúc chỉ còn là mấy chấm sáng mờ dần.',
  ],
  c92: [
    'Cả cái mạng lưới ống nước ấy có một tên gọi riêng:',
    'hệ dọn chất lải của não, chạy khắp trong não bạn.',
  ],
  c93: [
    'Nó là một mạng những ống nhỏ,',
    'ôm sát từng mạch máu khắp não bạn,',
    'chạy song song với chính mạch đó.',
  ],
  c94: [
    'Cứ mỗi lần bạn rơi vào giấc ngủ sâu,',
    'hệ dọn chất lải ấy lại chạy mạnh nhất.',
  ],
  c95: [
    'Đó là lúc não được dọn,',
    'và việc dọn ấy mạnh nhất đúng khi bạn đang ngủ,',
    'chứ không phải lúc thức.',
  ],
  c96: [
    'Cùng lúc đó não cũng chậm hẳn xuống:',
    'đó là lúc giấc ngủ sâu nhất,',
    'cũng là lúc dậy lên khó nhất.',
  ],
  c97: [
    'Mỗi đêm ngủ, cơ thể lặp lại đúng việc ấy:',
    'rác thần kinh được kéo ra khỏi não bằng chính dòng',
    'chất lỏng này.',
  ],
  c98: [
    'Đó là lúc giấc ngủ sâu nhất của đêm,',
    'và cũng là lúc dậy lên tốn sức nhất.',
  ],
  c99: [
    'Nhưng có một cách tỉnh dậy tệ hơn hẳn:',
    'tỉnh dậy giữa chừng, lúc giấc ngủ vẫn còn đang sâu,',
    'chưa xong.',
  ],
  c100: [
    'Lúc đó phần não dưới đã tỉnh lại,',
    'còn vỏ trán vẫn còn tối,',
    'phải chờ chừng hai mươi phút mới sáng lên hẳn.',
  ],
  c101: [
    'Bạn mở mắt rồi, nhưng vỏ trán chưa kịp sáng,',
    'nên việc gì cũng còn chậm.',
    'Số đo đó đến từ thí nghiệm đánh thức người trong đêm.',
  ],
  c102: [
    'Cảm giác lười nhác, mất đà ngay sau khi mở mắt ấy,',
    'chính là cơn lười sau khi ngủ mà ta đã gặp lúc đầu.',
  ],
  c103: [
    'Đi từ thức sang giấc ngủ sâu,',
    'chừng ba mươi phút là đủ rồi,',
    'và con số đó đo ở nhóm người thiếu ngủ.',
  ],
  c104: [
    'Áp lực ngủ sau giấc ngủ trưa đã giảm,',
    'nhưng não vẫn cần chừng mười lăm phút mới lên tốc,',
    'nên ta thấy mệt nặng hơn lúc mới nằm xuống.',
  ],
  c105: [
    'Mười lăm phút nghe có vẻ ngắn thế,',
    'nhưng đó là đúng thời gian ta cần để tỉnh hẳn.',
  ],
  c106: [
    'Còn vì sao ta dậy đúng lúc đó,',
    'thì phải nhìn vào chiếc đồng hồ bên trong não,',
    'không phải đồng hồ trên tường.',
  ],
  c107: [
    'Trong não bạn có hai cái đồng hồ,',
    'và cái thứ nhất không đo giờ,',
    'nó đo một vòng ngủ trọn vẹn.',
  ],
  c108: [
    'Một vòng của cái kim chậm ấy dài khoảng chín mươi',
    'phút, tức là một chu kỳ ngủ trọn vẹn của người.',
  ],
  c109: [
    'Trong một vòng ấy, giấc ngủ đi qua các giai đoạn,',
    'luân phiên qua lại,',
    'chứ không đứng yên ở một chỗ nào cả.',
  ],
  c110: [
    'Có lúc não lặn xuống giấc ngủ sâu,',
    'có lúc não nổi lên gần như thức, lúc giấc mơ chạy.',
  ],
  c111: [
    'Hai cái đồng hồ trong đầu bạn không giống nhau,',
    'và cái đo vòng ngủ này không quan tâm lúc này là mấy giờ.',
  ],
  c112: [
    'Nó chỉ biết bạn đã ngủ bao lâu kể từ lúc bạn nằm',
    'xuống, chứ không biết đồng hồ trên tường đang chỉ mấy giờ.',
  ],
  c113: [
    'Nhìn cái đồng hồ trong não,',
    'ta thấy một cái kim chậm, trơn tru, chạy đều đặn.',
  ],
  c114: [
    'Con số này chỉ là trung bình,',
    'mỗi người mỗi đêm vẫn có những vòng dài hơn hoặc',
    'ngắn hơn một chút.',
  ],
  c115: [
    'Nhưng điều đó không quan trọng lắm với câu hỏi của',
    'bạn, vì ba mươi phút ngủ trưa ấy đã đi qua cả đoạn',
    'giấc ngủ sâu.',
  ],
  c116: [
    'Trên cái đồng hồ trong não,',
    'ba mươi phút ấy mới chỉ là một phần ba vòng.',
  ],
  c117: [
    'Và đoạn giấc ngủ sâu ấy đã đủ làm não chậm hẳn xuống rồi.',
  ],
  c118: [
    'Nên lúc bạn mở mắt giữa giấc trưa,',
    'bạn đang ở đúng chỗ khó nhất để tỉnh lại,',
    'chỗ não còn nằm trong giấc ngủ sâu.',
  ],
  c119: [
    'Cái đồng hồ thứ hai thì đo ngày,',
    'và nó là một vòng đồng hồ chạy quanh một cụm tế bào',
    'bên trong não.',
  ],
  c120: [
    'Vòng đó trải dọc suốt một ngày,',
    'và đó là đồng hồ sinh học.',
  ],
  c121: [
    'Trên vòng đó có đầy những vạch nhỏ,',
    'và cái kim chỉ của nó chạy quanh một vòng trong cả',
    'ngày, đều đặn.',
  ],
  c122: [
    'Buổi chiều, cái kim ấy chỉ vào đúng lúc cơ thể thèm',
    'ngủ nhất.',
  ],
  c123: [
    'Buổi sáng nó còn cao,',
    'giữa trưa nó bắt đầu trượt xuống,',
    'và buổi chiều là lúc thấp nhất trong cả ngày.',
  ],
  c124: [
    'Trên vòng đồng hồ ấy,',
    'buổi chiều là một vùng được tô đậm,',
    'và một giờ chiều nằm ngay trong vùng trũng ấy.',
  ],
  c125: [
    'Ta tạm bước ra khỏi cái đầu, ra ngoài cửa sổ:',
    'điểm thấp nhất ấy rơi vào buổi chiều,',
    'khi mặt trời ngoài trời vẫn còn cao.',
  ],
  c126: [
    'Cùng lúc đó, xung quanh ta vẫn là tiếng xe cộ,',
    'tiếng người nói chuyện,',
    'tiếng xe chạy đều đều ngoài cửa sổ.',
  ],
  c127: [
    'Vậy mà cơ thể vẫn thèm ngủ,',
    'và cái gối gấp từ chiếc áo khoác trên bàn cứ tự',
    'nhiên trông quen thuộc.',
  ],
  c128: [
    'Buổi chiều là lúc cơ thể thèm ngủ nhất,',
    'nên giấc ngủ trưa cũng hay rơi vào đúng vùng trũng đó.',
  ],
  c129: [
    'Nên buổi chiều không phải lúc bạn chọn ngủ,',
    'mà là lúc cơ thể tự kéo bạn nằm xuống dù bạn vẫn còn',
    'việc để làm.',
  ],
  c130: [
    'Và hai cái đồng hồ ấy,',
    'cái đo vòng ngủ và cái đo ngày,',
    'hôm nay cùng chỉ vào một điểm đó.',
  ],
  c131: [
    'Đồng hồ trên tường chỉ một giờ ba mươi phút,',
    'và đó đúng là lúc bạn vừa mở mắt lên sau giấc trưa.',
  ],
  c132: [
    'Cái kim chậm của đồng hồ trong não vừa trôi qua đoạn',
    'giấc ngủ sâu, và đó là lúc não chậm nhất.',
  ],
  c133: [
    'Còn cái kim kia trên vòng đồng hồ sinh học thì vừa',
    'chạm tới vạch của buổi chiều,',
    'điểm thấp nhất trong ngày.',
  ],
  c134: [
    'Hai cái đồng hồ cùng chỉ một lúc,',
    'và bạn vừa mở mắt nằm ngay đúng chỗ hai đường ấy giao nhau.',
  ],
  c135: [
    'Ta ghép hai cái đồng hồ ấy lại,',
    'và đó là cách hiểu của tập phim:',
    'chỗ chúng cắt nhau chính là lúc bạn vừa mở mắt.',
  ],
  c136: [
    'Nên lúc đó có hai lý do cùng đè xuống bạn,',
    'mỗi lý do mang một kiểu nặng riêng.',
  ],
  c137: [
    'Lý do một, theo cách hiểu của tập,',
    'là bạn dậy đúng lúc não còn nằm trong giấc ngủ sâu —',
    'lúc đó cơn lười nặng nhất.',
  ],
  c138: [
    'Lý do hai là buổi chiều, lúc cơ thể vốn đã ở đáy,',
    'nên giấc ngủ trưa buổi ấy dễ kéo bạn rơi thẳng xuống',
    'giấc ngủ sâu.',
  ],
  c139: [
    'Nhưng ngủ trưa không phải chuyện miễn phí,',
    'và cái giá của nó hiện ra vào buổi tối,',
    'khi bạn nằm xuống.',
  ],
  c140: [
    'Một giấc ngủ trưa dài sẽ lấy bớt phần giấc ngủ mà',
    'đêm đó vốn phải có, và đêm sẽ ngắn lại.',
  ],
  c141: [
    'Những giấc ngủ trưa từ ba mươi phút trở lên thường',
    'đi kèm với việc đêm đó ta ngủ ít đi hơn.',
  ],
  c142: [
    'Ngủ trưa càng muộn trong ngày,',
    'thì giấc ngủ đêm đó của bạn càng ngắn lại.',
  ],
  c143: [
    'Một giấc ngủ trưa dài, kiểu ngủ chín mươi phút,',
    'mỗi ngày, có thể lấy mất chừng bốn mươi tám phút của',
    'giấc ngủ đêm.',
  ],
  c144: [
    'Sáng hôm sau, giấc ngủ đêm qua ngắn hơn,',
    'nên người ta lại mệt như cũ,',
    'lần này mệt vì thiếu ngủ.',
  ],
  c145: [
    'Nên một giấc ngủ trưa dài lấy mất nhiều giờ ban',
    'ngày, lẫn một phần của đêm hôm ấy nữa.',
  ],
  c146: [
    'Câu hỏi đầu tiên đã có lời giải rồi,',
    'nhưng còn một câu nữa chưa trả lời được:',
    'ngủ trưa bao lâu thì đủ?',
  ],
  c147: [
    'Trên bàn có một cái điện thoại đặt cạnh gối áo gấp,',
    'màn hình đang mở ô báo thức:',
    'mười phút hay hai mươi phút?',
  ],
  c148: [
    'Để biết đáp án, ta phải quay lại trong não bạn,',
    'xem giấc ngủ trôi sâu dần bao nhiêu kể từ lúc bạn nằm xuống.',
  ],
  c149: [
    'Trên mặt cắt não,',
    'sóng chậm đi xuống đúng khoảng phút thứ mười lăm,',
    'rồi bị cắt đứt lúc bạn mở mắt.',
  ],
  c150: [
    'Kết quả là một con số giản dị:',
    'giấc ngủ trưa từ mười đến hai mươi phút là đủ rồi,',
    'còn nằm lâu hơn thì dễ mệt hơn.',
  ],
  c151: [
    'Giấc ngủ trưa có chạm vào giấc ngủ sâu thì hay đi',
    'kèm cơn lười, và cả một đêm ngủ ít hơn nữa.',
  ],
  c152: [
    'Còn giấc ngủ trưa ngắn, mười phút,',
    'thì gần như không chạm giấc ngủ sâu,',
    'và ta mở mắt ra là thấy tỉnh ngay lập tức.',
  ],
  c153: [
    'Dậy đúng lúc đó,',
    'vỏ trán phải chờ chừng hai mươi phút mới lên tốc,',
    'và ta thấy mình lờ đờ hơn lúc mới nằm xuống.',
  ],
  c154: [
    'Và còn một hậu quả nữa:',
    'một giấc ngủ trưa dài sẽ lấy mất phần giấc ngủ của',
    'đêm khuya cùng ngày.',
  ],
  c155: [
    'Bây giờ còn một câu hỏi nữa,',
    'và nó cũng quan trọng không kém gì:',
    'ngủ trưa vào lúc nào trong ngày?',
  ],
  c156: [
    'Cái vòng đồng hồ trong não ấy, nhìn từ trên xuống,',
    'có hình một vòng chia theo từng giờ trong ngày.',
  ],
  c157: [
    'Vùng buổi chiều đó chính là chỗ thấp nhất của nhịp sinh học.',
  ],
  c158: [
    'Điểm trũng buổi chiều ấy có sẵn trong cơ thể,',
    'không phải do bữa ăn,',
    'và nó ghé xuất hiện ở mọi người,',
    'sớm hay muộn trong ngày.',
  ],
  c159: [
    'Buổi sáng thì cơ thể còn chưa ở chỗ thấp nhất của ngày.',
  ],
  c160: [
    'Nhưng cái giờ ta ngủ trưa không chỉ quyết định giấc',
    'ngủ trưa, nó còn quyết định cả đêm khuya hôm đó.',
  ],
  c161: [
    'Giấc ngủ trưa càng muộn trong chiều muộn,',
    'thì giấc ngủ đêm khuya cùng ngày càng bị rút ngắn.',
  ],
  c162: [
    'Nên mốc thực dụng để chọn giờ ngủ trưa cho chính',
    'mình là: ngủ trước ba giờ chiều,',
    'đừng kéo nó muộn hơn.',
  ],
  c163: [
    'Mốc này là ranh giới thực dụng để mỗi người tự đặt,',
    'chứ không phải một luật cứng áp cho tất cả mọi người.',
  ],
  c164: [
    'Nếu ngủ trưa lúc đó, đêm ta ngủ được nhiều hơn,',
    'và sáng hôm sau ta đỡ mệt vì thiếu ngủ hơn.',
  ],
  c165: [
    'Và còn một cách nữa,',
    'cách mà nhiều người làm mà ít ai biết tại sao:',
    'uống cà phê rồi nằm xuống ngay.',
  ],
  c166: [
    'Cà phê không làm ta có sức,',
    'nó chỉ ngồi chặn ở cửa buồn ngủ,',
    'đúng như cảnh cà phê chặn adenosin ở khe synapse.',
  ],
  c167: [
    'Cà phê còn một điều hay nữa: nó làm việc chậm,',
    'uống xong phải chờ khoảng ba mươi phút mới lên tiếng.',
  ],
  c168: [
    'Nên nếu uống xong rồi ngồi chờ,',
    'ta sẽ phải ngồi đó chịu buồn ngủ một lúc dài,',
    'mà cà phê thì chưa lên tiếng.',
  ],
  c169: [
    'Còn nếu uống xong rồi nằm xuống luôn,',
    'ta nằm đúng hai mươi phút, ngắn ngủi thôi,',
    'và lúc mở mắt thì không còn cơn lười nữa.',
  ],
  c170: [
    'Trong lúc ta nằm,',
    'cà phê kịp ngấm vào máu rồi lên não,',
    'tới khe synapse nơi có cửa chặn buồn ngủ.',
  ],
  c171: [
    'Khoảng ba mươi phút sau khi uống,',
    'phân tử cà phê đã lên não và ngồi chặn cửa buồn ngủ',
    'ở khe synapse.',
  ],
  c172: [
    'Ta mở mắt ra ở phút thứ hai mươi,',
    'còn cà phê thì mới tới khe ở phút thứ ba mươi;',
    'mười phút sau đó, không còn buồn ngủ để chịu.',
  ],
  c173: [
    'Ghép lại thì ra một cách: uống cà phê trước,',
    'nằm xuống hai mươi phút,',
    'rồi đứng dậy — đến lúc cà phê lên tiếng thì buồn ngủ',
    'cũng vừa được chặn.',
  ],
  c174: [
    'Còn nếu uống sau,',
    'tức là sau khi đã dậy lên rồi mới uống,',
    'thì cà phê vẫn còn đang trên đường đi tới,',
    'và bạn phải chờ thêm.',
  ],
  c175: [
    'Nhưng nói thật,',
    'cả cách cà phê lẫn giấc ngủ trưa chỉ che được tạm',
    'thời; gốc của cơn mệt vẫn nằm ở đêm.',
  ],
  c176: [
    'Có một cách giải thích nữa,',
    'không phải từ số liệu mà từ cơ chế:',
    'giấc ngủ trưa lấy bớt áp lực ngủ.',
  ],
  c177: [
    'Nên tối hôm đó ta ngủ ít đi, sáng hôm sau vẫn mệt,',
    'vì giấc ngủ trưa không bù lại được phần thiếu ban đêm.',
  ],
  c178: [
    'Nên gốc rễ của chuyện này nằm ở đêm,',
    'chứ không nằm ở cái gối áo gấp trên bàn lúc buổi chiều.',
  ],
  c179: [
    'Cái điểm trũng buổi chiều là của nhịp sinh học,',
    'không phải do đêm qua thiếu ngủ;',
    'ngủ đủ ban đêm chỉ giúp đêm đó không bị rút ngắn.',
  ],
  c180: [
    'Quay lại câu hỏi lúc đầu thì câu trả lời đã gọn:',
    'dậy giữa chừng giấc ngủ sâu thì não chưa kịp lên tốc.',
  ],
  c181: [
    'Còn nếu đêm qua đã ngủ đủ, áp lực ngủ vẫn còn nhiều,',
    'nên tối hôm đó bạn vẫn ngủ được trọn đêm,',
    'đêm không bị rút ngắn.',
  ],
  c182: [
    'Vậy nên giấc ngủ trưa cứ ngắn và ngủ sớm,',
    'còn đêm vẫn phải ngủ cho đủ,',
    'đừng dựa vào giấc ngủ trưa để bù.',
  ],
  c183: [
    'Chiếc gối áo gấp trên bàn sẽ được gấp lại và cất đi,',
    'còn đêm thì người ta đi ngủ đúng giờ.',
  ],
  c184: [
    'Chiếc gối áo gấp trên bàn được gấp lại và cất đi,',
    'còn buổi tối thì bạn đi ngủ đúng giờ.',
  ],
  c185: [
    'Vậy thì câu hỏi lúc đầu đã có lời giải:',
    'buổi chiều cơ thể rơi thẳng vào giấc ngủ sâu,',
    'nên dậy giữa chừng là dậy khi não còn nằm trong đó.',
  ],
};


// Bộ máy của timeline: đọc độ dài thật của từng câu (dur.json), mốc thời gian từng từ
// (words.json) và miệng của nhân vật (lips.json), rồi dựng các mốc thời gian cho phim.
// Không có mốc nào gõ tay: mọi thứ đến từ giọng đọc đã thu.

// Bỏ dấu và bỏ dấu câu, để một từ tìm được trong kết quả ASR dù Whisper viết thế nào.
export const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w]/g, '');

// các từ đếm: một cụm số không được cắt làm đôi, và không dùng làm từ khóa
const NUM = new Set(['khong', 'mot', 'hai', 'ba', 'bon', 'nam', 'sau', 'bay', 'tam', 'chin',
  'muoi', 'lam', 'muoi', 'tram', 'nghin', 'ngan', 'chuc', 'linh', 'le', 'phan', 'trieu', 'ty', 'ti']);

// vị trí một từ trong kết quả ASR, tìm từ `from` trở đi; -1 khi không có
function wordIndex(ws, want, from = 0) {
  const t = norm(want);
  if (!t) return -1;
  for (let i = from; i < ws.length; i++) if (norm(ws[i].w) === t) return i;
  for (let i = from; i < ws.length; i++) { const n = norm(ws[i].w); if (n && (n.startsWith(t) || t.startsWith(n))) return i; }
  return -1;
}

export function build(dur, words, lips) {
  const L = {}; let t = 0;
  for (const [id, gap] of SEQ) { t += gap; L[id] = { id, t0: t, t1: t + dur[id] }; t += dur[id]; }
  const end = t + TAIL;
  const ids = SEQ.map(s => s[0]);

  // thời gian tuyệt đối của một từ trong một câu
  const w = (id, k) => {
    const ws = words[id] || [], i = typeof k === 'string' ? wordIndex(ws, k) : Math.min(k, Math.max(0, ws.length - 1));
    const hit = ws[i];
    if (!hit) return L[id].t0;
    return L[id].t0 + Math.max(0, Math.min(L[id].t1 - L[id].t0, hit.t0));
  };

  // các mảnh phụ đề: mỗi mảnh bắt đầu ở từ đang nói (từ khóa của nó), và kết thúc khi mảnh sau bắt đầu.
  const cues = [];
  ids.forEach((id, n) => {
    const ws = words[id] || [];
    const parts = SUBS[id].map(p => {
      const text = typeof p === 'string' ? p : p[1];
      const toks = text.split(/\s+/);
      let key = toks[0];
      if (NUM.has(norm(key))) { const alt = toks.find(t => !NUM.has(norm(t))); if (alt) key = alt; }
      return { text, key: toks.length ? key : null };
    });
    const total = parts.reduce((a, p) => a + p.text.length, 0);
    let acc = 0, cursor = 0;
    parts.forEach((p, i) => {
      const share = acc / total; acc += p.text.length;
      let idx = -1;
      if (i > 0 && p.key) idx = wordIndex(ws, p.key, cursor);
      if (idx < 0 && i > 0) idx = Math.max(cursor, Math.round(share * Math.max(0, ws.length - 1)));
      if (i === 0) idx = 0;
      p.idx = Math.min(idx, Math.max(0, ws.length - 1));
      p.t0 = L[id].t0 + Math.max(0, Math.min(dur[id], (ws[p.idx] || { t0: 0 }).t0));
      const lastTok = p.text.split(/\s+/).pop();
      const li = wordIndex(ws, lastTok, p.idx);
      cursor = (li >= 0 ? li : p.idx) + 1;
    });
    const nextT = n + 1 < ids.length ? L[ids[n + 1]].t0 - .04 : end;
    parts.forEach((p, i) => {
      let t1 = i + 1 < parts.length ? parts[i + 1].t0 : Math.min(nextT, Math.max(L[id].t1 + .6, p.t0 + 1.8));
      if (t1 <= p.t0 + .25) t1 = Math.min(nextT, p.t0 + .6);
      cues.push({ id, text: p.text, t0: +p.t0.toFixed(3), t1: +t1.toFixed(3) });
    });
  });

  // miệng: giọng đọc điều khiển nó ở 12 fps (mỗi giá trị 1/24 s, giữ một nhịp), đóng giữa các câu
  const talk = T => {
    for (const id of ids) {
      const l = L[id];
      if (T >= l.t0 && T < l.t1) {
        const lp = lips[id];
        if (!lp || !lp.o || !lp.o.length) return { o: 0, b: .5 };
        const i = Math.min(lp.o.length - 1, Math.floor((T - l.t0) * 12) * 2);
        return { o: lp.o[i] || 0, b: (lp.b && lp.b[i]) || .5 };
      }
    }
    return { o: 0, b: .5 };
  };

  return { L, SEQ, SUBS, cues, talk, end, w, words };
}
