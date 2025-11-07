
Mỗi nhóm phải đạt 15-20 đơn/ngày với CPA rẻ, để cả chiến dịch có thể chạm mốc 50 đơn/ngày.


Tài liệu Logic Tối ưu Ngân sách: Chiến lược "Săn đơn Chớp nhoáng"
I. Triết lý & Mục tiêu Chung
Mục tiêu: Tối đa hóa số lượng đơn hàng (Volume) trong ngày với CPA mục tiêu cực kỳ cạnh tranh. Mục tiêu là 50 đơn/chiến dịch/ngày.
Triết lý:
Sàng lọc Khắc nghiệt buổi Sáng: Nhanh chóng xác định các nhóm "hạt giống" có tiềm năng và loại bỏ ngay lập tức các nhóm yếu.
Kiểm soát Tốc độ chi tiêu (Pacing) buổi Chiều: Đảm bảo các nhóm tiềm năng không "đốt tiền" quá nhanh hoặc "ngủ quên", giữ chúng ở trạng thái tối ưu nhất.
Tất tay cho "Giờ Vàng" buổi Tối: Dồn toàn lực cho các nhóm chiến thắng vào khung giờ chuyển đổi cao nhất, không do dự.


Quy tắc Nền tảng:
Mỗi ngày là một trận chiến mới, ngân sách reset về 150k.
Một nhóm chỉ được xem xét để tăng ngân sách khi đã có ít nhất 2 đơn hàng. Nếu chưa đủ 2 đơn, nó chỉ có thể bị Giữ hoặc Giảm.


II. Luồng Xử lý Tổng thể (Cách máy tính sẽ hoạt động)
Khi bấm nút [KIỂM TRA], luồng xử lý sẽ như sau:
Tính elapsed_hours: Lấy giờ hiện tại trừ đi 0h00.
Phân loại Khung giờ:
if (elapsed_hours <= 12.5): Thực thi bộ quy tắc KHUNG 10:30.
else if (elapsed_hours <= 16.5): Thực thi bộ quy tắc KHUNG 14:30.
else if (elapsed_hours <= 22.5): Thực thi bộ quy tắc KHUNG 17:30.
else: Hiển thị thông báo "Ngoài giờ tối ưu".


Áp dụng Quy tắc: Bên trong mỗi khung giờ, hệ thống sẽ kiểm tra các trường hợp từ trên xuống dưới. Khi một điều kiện được thỏa mãn, nó sẽ đưa ra đề xuất và dừng lại.

III. Chi tiết Bộ Quy tắc Theo Khung Giờ
KHUNG 10:30 - SÀNG LỌC & TĂNG TỐC
(Mục tiêu: Nhanh chóng xác định "ngựa chiến" và bơm vốn ban đầu)
Trường hợp 1 (Siêu Sao):
Điều kiện: Số đơn >= 7 VÀ Tiền đã tiêu <= 0.7 * Ngân sách hiện tại.
Hành động: TĂNG RẤT MẠNH.
Đề xuất: x3 Ngân sách hiện tại.
Lý do: "Tín hiệu bùng nổ! Cần bơm vốn ngay lập tức để chiếm lĩnh thị trường."


Trường hợp 2 (Hiệu suất Vàng):
Điều kiện: Số đơn >= 4 VÀ CPA hiện tại <= 0.75 * CPA mục tiêu.
Hành động: TĂNG MẠNH.
Đề xuất: x2.5 Ngân sách hiện tại.
Lý do: "Hiệu suất xuất sắc, CPA cực rẻ. Mở rộng quy mô ngay."


Trường hợp 3 (Hiệu suất Tốt):
Điều kiện: Số đơn >= 4 VÀ 0.75 * CPA mục tiêu < CPA hiện tại <= 0.85 * CPA mục tiêu.
Hành động: TĂNG VỪA.
Đề xuất: x2 Ngân sách hiện tại.
Lý do: "Hiệu suất tốt, CPA trong ngưỡng an toàn. Tiếp tục đẩy mạnh."


Trường hợp 4 (Tiềm năng):
Điều kiện: 2 <= Số đơn < 4 VÀ CPA hiện tại <= 0.85 * CPA mục tiêu.
Hành động: TĂNG NHẸ.
Đề xuất: x1.5 Ngân sách hiện tại.
Lý do: "Có tín hiệu đơn tốt và CPA rẻ. Tăng nhẹ để thăm dò."


Trường hợp 5 (Cắt lỗ sớm - Bổ sung của chuyên gia):
Điều kiện: Số đơn < 2 VÀ Tiền đã tiêu >= 0.8 * CPA mục tiêu.
Hành động: GIẢM MẠNH.
Đề xuất: x0.7 Ngân sách hiện tại.
Lý do: "Rủi ro cao. Đã tiêu đáng kể nhưng không có đủ tín hiệu chuyển đổi."


Trường hợp 6 (Mặc định):
Điều kiện: Không thuộc các trường hợp trên.
Hành động: GIỮ NGUYÊN.
Lý do: "Dữ liệu chưa đủ rõ ràng. Cần theo dõi thêm đến khung giờ tiếp theo."



KHUNG 14:30 - ĐÁNH GIÁ PACING & TỐI ƯU
(Mục tiêu: Đảm bảo tiền được tiêu một cách thông minh, không quá nhanh cũng không quá chậm)
Nhóm 1: Pacing < 65% (Tiêu tiền CHẬM)
Trường hợp 1.1: Số đơn >= 6 VÀ CPA hiện tại <= 0.8 * CPA mục tiêu. -> Hành động: TĂNG NHẸ (x1.5). Lý do: "Hiệu suất rất tốt nhưng cần tăng tốc chi tiêu."
Trường hợp 1.2: Số đơn >= 2 VÀ CPA hiện tại <= 0.9 * CPA mục tiêu. -> Hành động: GIỮ NGUYÊN. Lý do: "Hiệu suất ổn, cần theo dõi thêm."
Trường hợp 1.3: Số đơn < 2 HOẶC CPA hiện tại > CPA mục tiêu. -> Hành động: GIẢM (x0.7). Lý do: "Vừa tiêu tiền chậm, vừa không hiệu quả. Cần siết chặt ngân sách."
Nhóm 2: 65% <= Pacing <= 85% (Tiêu tiền ỔN ĐỊNH)
Trường hợp 2.1 (Bổ sung): Số đơn >= 8 VÀ CPA hiện tại <= 0.85 * CPA mục tiêu. -> Hành động: TĂNG NHẸ (x1.3). Lý do: "Trạng thái hoàn hảo. Tăng nhẹ để duy trì đà tăng trưởng."
Trường hợp 2.2 (Bổ sung): Số đơn >= 4 VÀ CPA hiện tại <= CPA mục tiêu. -> Hành động: GIỮ NGUYÊN. Lý do: "Nhóm đang hoạt động tốt và ổn định. Không can thiệp."
Trường hợp 2.3 (Bổ sung): CPA hiện tại > CPA mục tiêu. -> Hành động: GIẢM (x0.8). Lý do: "Pacing ổn định nhưng CPA đang có dấu hiệu tăng. Cần kiểm soát."
Nhóm 3: Pacing > 85% (Tiêu tiền NHANH)
Trường hợp 3.1 (Bổ sung): Số đơn >= 10 VÀ CPA hiện tại <= CPA mục tiêu. -> Hành động: GIỮ NGUYÊN. Lý do: "Nhóm đang thắng lớn, chấp nhận Pacing nhanh. Không bơm thêm để tránh mất ổn định."
Trường hợp 3.2 (Bổ sung): Các trường hợp còn lại. -> Hành động: GIẢM MẠNH (x0.6). Lý do: "Cảnh báo! Nhóm đang đốt tiền quá nhanh mà không đủ hiệu quả. Phải giảm ngay."

KHUNG 17:30 - QUYẾT ĐỊNH CUỐI CÙNG CHO "GIỜ VÀNG"
(Mục tiêu: Dồn hết tài nguyên cho "ngựa chiến" để về đích, cắt bỏ mọi gánh nặng)
Trường hợp 1 (Siêu Sao Về Đích):
Điều kiện: Số đơn >= 12 VÀ CPA hiện tại <= 0.8 * CPA mục tiêu.
Hành động: TĂNG MẠNH CUỐI NGÀY.
Đề xuất: x1.5 Ngân sách hiện tại.
Lý do: "Đây là nhóm tốt nhất! Tất tay cho Giờ Vàng để tối đa hóa lợi nhuận."


Trường hợp 2 (Chiến Binh Ổn định):
Điều kiện: Số đơn >= 8 VÀ CPA hiện tại <= CPA mục tiêu.
Hành động: GIỮ NGUYÊN.
Lý do: "Nhóm đang hoạt động rất ổn định. Giữ nguyên để nó tự tin chạy hết Giờ Vàng."


Trường hợp 3 (Cắt bỏ Gánh nặng):
Điều kiện: Không thuộc 2 trường hợp trên.
Hành động: GIẢM MẠNH / TẮT.
Đề xuất: x0.5 Ngân sách hiện tại (Hoặc đặt về 0 nếu quá tệ).
Lý do: "Không đủ hiệu quả để đầu tư vào Giờ Vàng. Giảm mạnh để bảo vệ vốn."



