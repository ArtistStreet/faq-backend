/**
 * Cấu hình ứng dụng
 *
 * File này chứa tất cả các cấu hình của ứng dụng, được lấy từ biến môi trường.
 * Mỗi cấu hình đều có giá trị mặc định để đảm bảo ứng dụng vẫn hoạt động
 * ngay cả khi không có file .env.
 */

import * as dotenv from 'dotenv';

// Tải biến môi trường từ file .env
dotenv.config();
// Tải lại để đảm bảo file .env cụ thể được ưu tiên
dotenv.config({ path: '.env' });

export const appConf = {
    /**
     * Môi trường chạy ứng dụng: 'development', 'production', 'test'
     * Được sử dụng để xác định các cấu hình khác nhau cho từng môi trường
     */
    NODE_ENV: process.env.NODE_ENV || 'development',

    /**
     * Cấu hình kết nối cơ sở dữ liệu PostgreSQL
     */
    PG_HOST: process.env.PG_HOST || 'localhost', // Địa chỉ máy chủ PostgreSQL
    PG_PORT: parseInt(process.env.PG_PORT || '5432'), // Cổng kết nối PostgreSQL
    PG_USER: process.env.PG_USER || 'postgres', // Tên người dùng PostgreSQL
    PG_PASS: process.env.PG_PASS || '', // Mật khẩu PostgreSQL
    PG_DB: process.env.PG_DB || 'test', // Tên cơ sở dữ liệu PostgreSQL

    /**
     * Cấu hình CORS (Cross-Origin Resource Sharing)
     * Xác định domain được phép truy cập API
     */
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

    /**
     * Cổng mà ứng dụng sẽ lắng nghe
     */
    APP_PORT: parseInt(process.env.APP_PORT || '8008'),

    /**
     * Cấu hình JWT (JSON Web Token) cho Access Token
     */
    AT_SECRET: process.env.AT_SECRET || '', // Khóa bí mật cho Access Token
    AT_TIMEOUT: process.env.AT_TIMEOUT || '24h', // Thời gian hết hạn của Access Token

    /**
     * Cấu hình JWT (JSON Web Token) cho Refresh Token
     */
    RT_SECRET: process.env.RT_SECRET || 'rtSecretKey', // Khóa bí mật cho Refresh Token
    RT_TIMEOUT: process.env.RT_TIMEOUT || '30d', // Thời gian hết hạn của Refresh Token

    /**
     * Giới hạn số lần gửi yêu cầu quên mật khẩu
     */
    LIMIT_SEND_FORGOT_PASS: parseInt(process.env.LIMIT_SEND_FORGOT_PASS || '5'),

    /**
     * Thời gian hết hạn của mã OTP (One-Time Password) tính bằng giờ
     */
    OTP_EXPIRATION_TIME: parseInt(process.env.OTP_EXPIRATION_TIME || '1'),

    /**
     * Số lượng bản ghi mặc định trên mỗi trang khi phân trang
     */
    PAGE_DEFAULT: parseInt(process.env.PAGE_DEFAULT || '20'),

    /**
     * Cấu hình upload file
     */
    LIMIT_UPLOAD_SIZE: parseInt(process.env.LIMIT_UPLOAD_SIZE || '5'), // Giới hạn kích thước file (MB)
    MAX_FILES_PER_UPLOAD: parseInt(process.env.MAX_FILES_PER_UPLOAD || '5'), // Số lượng file tối đa trong một lần upload

    /**
     * Danh sách các loại file được phép upload
     */
    ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,webp,bmp').split(','),

    /**
     * Danh sách các MIME type được phép upload
     */
    ALLOWED_MIME_TYPES: (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/gif,image/webp,image/bmp').split(
        ','
    ),

    /**
     * URL cơ sở của API
     */
    API_URL: process.env.API_URL || 'http://localhost:8003/',

    /**
     * Cấu hình email server
     */
    MAIL_HOST: process.env.MAIL_HOST || '', // Địa chỉ máy chủ email
    MAIL_PORT: parseInt(process.env.MAIL_PORT || '0'), // Cổng kết nối email server
    MAIL_USER: process.env.MAIL_USER || '', // Tên đăng nhập email
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || '', // Mật khẩu email
    MAIL_FROM: process.env.MAIL_FROM || '', // Địa chỉ email gửi
    SUPPORT_MAIL: process.env.SUPPORT_MAIL || '', // Địa chỉ email hỗ trợ
};

export default appConf;
