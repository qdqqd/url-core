use wasm_bindgen::prelude::*;
use js_sys::{Uint8ClampedArray};
use web_sys::ImageData;
use md5::{Md5, Digest};

// MD5实现
#[wasm_bindgen]
pub fn md5(input: &str) -> String {
    md5_hash(input)
}

fn md5_hash(input: &str) -> String {
    // 这是一个完整的MD5实现
    let mut hasher = Md5::new();
    hasher.update(input);
    let result = hasher.finalize();
    format!("{:x}", result)
}

// 生成置换数组的辅助函数
fn amess(arrlength: usize, ast: &str) -> Vec<usize> {
    let mut arr: Vec<usize> = (0..arrlength).collect();
    
    for i in (1..arrlength).rev() {
        let md5_str = format!("{}{}", ast, i);
        let mut hasher = Md5::new();
        hasher.update(&md5_str);
        let hash = hasher.finalize();
        // 使用前7个字符的十六进制值，与JavaScript版本保持一致
        let hex_str = format!("{:x}", hash);
        let sub_str = &hex_str[..std::cmp::min(7, hex_str.len())];
        let rand = u32::from_str_radix(sub_str, 16).unwrap_or(0) as usize % (i + 1);
        arr.swap(rand, i);
    }
    arr
}

// 生成Logistic映射序列
fn produce_logistic(x1: f64, n: usize) -> Vec<(f64, usize)> {
    let mut l = Vec::with_capacity(n);
    let mut x = x1;
    l.push((x, 0));
    
    for i in 1..n {
        x = 3.9999999 * x * (1.0 - x);
        l.push((x, i));
    }
    l
}

// Logistic排序函数
fn produce_logistic_sort(a: &(f64, usize), b: &(f64, usize)) -> std::cmp::Ordering {
    a.0.partial_cmp(&b.0).unwrap_or(std::cmp::Ordering::Equal)
}

// 生成Gilbert曲线
fn generate_gilbert_curve(width: usize, height: usize) -> Vec<(usize, usize)> {
    let mut coordinates = Vec::new();
    
    // 使用递归算法生成Gilbert曲线
    fn generate(
        x: usize,
        y: usize,
        ax: isize,
        ay: isize,
        bx: isize,
        by: isize,
        coordinates: &mut Vec<(usize, usize)>,
    ) {
        let w = (ax + ay).abs() as usize;
        let h = (bx + by).abs() as usize;
        let dax = ax.signum();
        let day = ay.signum();
        let dbx = bx.signum();
        let dby = by.signum();
        
        if h == 1 {
            let mut cx = x;
            let mut cy = y;
            for _ in 0..w {
                coordinates.push((cx, cy));
                cx = (cx as isize + dax) as usize;
                cy = (cy as isize + day) as usize;
            }
            return;
        }
        
        if w == 1 {
            let mut cx = x;
            let mut cy = y;
            for _ in 0..h {
                coordinates.push((cx, cy));
                cx = (cx as isize + dbx) as usize;
                cy = (cy as isize + dby) as usize;
            }
            return;
        }
        
        let ax2 = ax.div_euclid(2);
        let ay2 = ay.div_euclid(2);
        let bx2 = bx.div_euclid(2);
        let by2 = by.div_euclid(2);
        let w2 = (ax2 + ay2).abs() as usize;
        let h2 = (bx2 + by2).abs() as usize;
        
        if 2 * w > 3 * h {
            let new_ax2 = if (w2 % 2) != 0 && w > 2 { ax2 + dax } else { ax2 };
            let new_ay2 = if (w2 % 2) != 0 && w > 2 { ay2 + day } else { ay2 };
            generate(x, y, new_ax2, new_ay2, bx, by, coordinates);
            let new_x = x + new_ax2 as usize;
            let new_y = y + new_ay2 as usize;
            generate(new_x, new_y, ax - new_ax2, ay - new_ay2, bx, by, coordinates);
        } else {
            let new_bx2 = if (h2 % 2) != 0 && h > 2 { bx2 + dbx } else { bx2 };
            let new_by2 = if (h2 % 2) != 0 && h > 2 { by2 + dby } else { by2 };
            generate(x, y, new_bx2, new_by2, ax2, ay2, coordinates);
            let new_x = x + new_bx2 as usize;
            let new_y = y + new_by2 as usize;
            generate(new_x, new_y, ax, ay, bx - new_bx2, by - new_by2, coordinates);
            let x2 = x + (ax - dax) as usize + (bx2 - dbx) as usize;
            let y2 = y + (ay - day) as usize + (by2 - dby) as usize;
            generate(x2, y2, -bx2, -by2, -(ax - ax2), -(ay - ay2), coordinates);
        }
    }
    
    let x = 0;
    let y = 0;
    
    if width >= height {
        generate(x, y, width as isize, 0, 0, height as isize, &mut coordinates);
    } else {
        generate(x, y, 0, height as isize, width as isize, 0, &mut coordinates);
    }
    
    coordinates
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_offset_calculation() {
        let width = 4;
        let height = 4;
        
        // JavaScript版本的计算方式
        let js_offset = (((5.0f64.sqrt() - 1.0) / 2.0) * (width * height) as f64).round() as usize;
        
        // 验证计算结果
        // 应该是 (sqrt(5) - 1) / 2 * 16 = 0.618... * 16 ≈ 9.888... ≈ 10
        assert_eq!(js_offset, 10);
    }
    
    #[test]
    fn test_gilbert_curve_simple() {
        let width = 2;
        let height = 2;
        
        // 生成Gilbert曲线并打印
        let curve = generate_gilbert_curve(width, height);
        
        // 验证曲线点数
        assert_eq!(curve.len(), width * height);
        
        // 打印曲线坐标用于调试
        println!("Gilbert curve for 2x2:");
        for (i, (x, y)) in curve.iter().enumerate() {
            println!("  {}: ({}, {})", i, x, y);
        }
    }
    
    // #[test]
    // fn test_xfq_single_encrypt_decrypt() {
    //     // 创建一个简单的2x2图像数据 (每个像素4个通道)
    //     let width = 2;
    //     let height = 2;
    //     let img_data = vec![
    //         255, 0, 0, 255,     // 红色像素 (0,0)
    //         0, 255, 0, 255,     // 绿色像素 (1,0)
    //         0, 0, 255, 255,     // 蓝色像素 (0,1)
    //         255, 255, 0, 255    // 黄色像素 (1,1)
    //     ];

    //     // 生成Gilbert曲线
    //     let curve = generate_gilbert_curve(width, height);
    //     println!("Gilbert curve for 2x2:");
    //     for (i, (x, y)) in curve.iter().enumerate() {
    //         println!("  {}: ({}, {})", i, x, y);
    //     }
    //     
    //     // 计算偏移量
    //     let offset = (((5.0f64.sqrt() - 1.0) / 2.0) * (width * height) as f64).round() as usize;
    //     println!("Offset: {}", offset);

    //     // 测试单次加密
    //     let encrypted = encrypt_xiao_fan_qie(&img_data, width, height);
    //     println!("Original data: {:?}", img_data);
    //     println!("Encrypted data: {:?}", encrypted);

    //     // 测试单次解密
    //     let decrypted = decrypt_xiao_fan_qie(&encrypted, width, height);
    //     println!("Decrypted data: {:?}", decrypted);
    //     
    //     // 验证解密是否正确恢复了原始数据
    //     assert_eq!(img_data, decrypted);
    // }

    // #[test]
    // fn test_xfq_multiple_encrypt_decrypt() {
    //     // 创建一个简单的2x2图像数据 (每个像素4个通道)
    //     let width = 2;
    //     let height = 2;
    //     let img_data = vec![
    //         255, 0, 0, 255,     // 红色像素 (0,0)
    //         0, 255, 0, 255,     // 绿色像素 (1,0)
    //         0, 0, 255, 255,     // 蓝色像素 (0,1)
    //         255, 255, 0, 255    // 黄色像素 (1,1)
    //     ];

    //     let count = 3;

    //     // 测试多次加密
    //     let encrypted = encrypt_xiao_fan_qie_multiple(&img_data, width, height, count);
    //     println!("Original data: {:?}", img_data);
    //     println!("Encrypted data ({} times): {:?}", count, encrypted);

    //     // 测试多次解密
    //     let decrypted = decrypt_xiao_fan_qie_multiple(&encrypted, width, height, count);
    //     println!("Decrypted data: {:?}", decrypted);
    //     
    //     // 验证解密是否正确恢复了原始数据
    //     assert_eq!(img_data, decrypted);
    // }
}

// B模式 - 块混淆（兼容旧版本）
fn encrypt_b2(img_data: &[u8], width: usize, height: usize, key: &str, sx: usize, sy: usize) -> (Vec<u8>, usize, usize) {
    let mut wid = width;
    let mut hit = height;
    
    while wid % sx > 0 { wid += 1; }
    while hit % sy > 0 { hit += 1; }

    let ssx = wid / sx;
    let ssy = hit / sy;

    let xl = amess(sx, key);
    let yl = amess(sy, key);

    let mut result = vec![0u8; wid * hit * 4];
    
    for i in 0..wid {
        for j in 0..hit {
            let mut m = i;
            let mut n = j;
            m = (xl[(n / ssy) % sx] * ssx + m) % wid;
            m = xl[m / ssx] * ssx + m % ssx;
            n = (yl[(m / ssx) % sy] * ssy + n) % hit;
            n = yl[n / ssy] * ssy + n % ssy;

            let src_idx = 4 * (m + n * wid);
            let dest_idx = 4 * (i + j * wid);
            
            if src_idx + 3 < img_data.len() && dest_idx + 3 < result.len() {
                result[dest_idx] = img_data[src_idx];
                result[dest_idx + 1] = img_data[src_idx + 1];
                result[dest_idx + 2] = img_data[src_idx + 2];
                result[dest_idx + 3] = img_data[src_idx + 3];
            }
        }
    }
    
    (result, wid, hit)
}

// B模式 - 解密
fn decrypt_b2(img_data: &[u8], width: usize, height: usize, key: &str, sx: usize, sy: usize) -> (Vec<u8>, usize, usize) {
    let mut wid = width;
    let mut hit = height;
    
    while wid % sx > 0 { wid += 1; }
    while hit % sy > 0 { hit += 1; }

    let ssx = wid / sx;
    let ssy = hit / sy;

    let xl = amess(sx, key);
    let yl = amess(sy, key);

    let mut result = vec![0u8; wid * hit * 4];
    
    for i in 0..wid {
        for j in 0..hit {
            let mut m = i;
            let mut n = j;
            m = (xl[(n / ssy) % sx] * ssx + m) % wid;
            m = xl[m / ssx] * ssx + m % ssx;
            n = (yl[(m / ssx) % sy] * ssy + n) % hit;
            n = yl[n / ssy] * ssy + n % ssy;

            let src_idx = 4 * (i + j * wid);
            let dest_idx = 4 * (m + n * wid);
            
            if src_idx + 3 < img_data.len() && dest_idx + 3 < result.len() {
                result[dest_idx] = img_data[src_idx];
                result[dest_idx + 1] = img_data[src_idx + 1];
                result[dest_idx + 2] = img_data[src_idx + 2];
                result[dest_idx + 3] = img_data[src_idx + 3];
            }
        }
    }
    
    (result, wid, hit)
}

// C模式 - 逐像素混淆
fn encrypt_c(img_data: &[u8], width: usize, height: usize, key: &str) -> Vec<u8> {
    let xl = amess(width, key);
    let yl = amess(height, key);

    let mut result = vec![0u8; img_data.len()];
    
    for i in 0..width {
        for j in 0..height {
            let mut m = i;
            let mut n = j;
            m = (xl[j % width] + m) % width;
            m = xl[m];
            n = (yl[m % height] + n) % height;
            n = yl[n];
            
            let src_idx = (m + n * width) << 2; // 位运算替代乘法
            let dest_idx = (i + j * width) << 2; // 位运算替代乘法
            
            if src_idx + 3 < img_data.len() && dest_idx + 3 < result.len() {
                result[dest_idx] = img_data[src_idx];
                result[dest_idx + 1] = img_data[src_idx + 1];
                result[dest_idx + 2] = img_data[src_idx + 2];
                result[dest_idx + 3] = img_data[src_idx + 3];
            }
        }
    }
    
    result
}

// C模式 - 解密
fn decrypt_c(img_data: &[u8], width: usize, height: usize, key: &str) -> Vec<u8> {
    let xl = amess(width, key);
    let yl = amess(height, key);

    let mut result = vec![0u8; img_data.len()];
    
    for i in 0..width {
        for j in 0..height {
            let mut m = i;
            let mut n = j;
            m = (xl[j % width] + m) % width;
            m = xl[m];
            n = (yl[m % height] + n) % height;
            n = yl[n];
            
            let src_idx = (i + j * width) << 2; // 位运算替代乘法
            let dest_idx = (m + n * width) << 2; // 位运算替代乘法
            
            if src_idx + 3 < img_data.len() && dest_idx + 3 < result.len() {
                result[dest_idx] = img_data[src_idx];
                result[dest_idx + 1] = img_data[src_idx + 1];
                result[dest_idx + 2] = img_data[src_idx + 2];
                result[dest_idx + 3] = img_data[src_idx + 3];
            }
        }
    }
    
    result
}

// C2模式 - 行像素混淆
fn encrypt_c2(img_data: &[u8], width: usize, height: usize, key: &str) -> Vec<u8> {
    let xl = amess(width, key);
    let mut result = vec![0u8; img_data.len()];
    
    for i in 0..width {
        for j in 0..height {
            let m = xl[(xl[j % width] + i) % width];
            let src_idx = (m + j * width) << 2; // 位运算替代乘法
            let dest_idx = (i + j * width) << 2; // 位运算替代乘法
            
            if src_idx + 3 < img_data.len() && dest_idx + 3 < result.len() {
                result[dest_idx] = img_data[src_idx];
                result[dest_idx + 1] = img_data[src_idx + 1];
                result[dest_idx + 2] = img_data[src_idx + 2];
                result[dest_idx + 3] = img_data[src_idx + 3];
            }
        }
    }
    
    result
}

// C2模式 - 解密
fn decrypt_c2(img_data: &[u8], width: usize, height: usize, key: &str) -> Vec<u8> {
    let xl = amess(width, key);
    let mut result = vec![0u8; img_data.len()];
    
    for i in 0..width {
        for j in 0..height {
            let m = xl[(xl[j % width] + i) % width];
            let src_idx = (i + j * width) << 2; // 位运算替代乘法
            let dest_idx = (m + j * width) << 2; // 位运算替代乘法
            
            if src_idx + 3 < img_data.len() && dest_idx + 3 < result.len() {
                result[dest_idx] = img_data[src_idx];
                result[dest_idx + 1] = img_data[src_idx + 1];
                result[dest_idx + 2] = img_data[src_idx + 2];
                result[dest_idx + 3] = img_data[src_idx + 3];
            }
        }
    }
    
    result
}

// PE1模式 - 行混淆
fn encrypt_pe1(img_data: &[u8], width: usize, height: usize, key2: f64) -> Vec<u8> {
    let mut logistic_data = produce_logistic(key2, width);
    logistic_data.sort_by(produce_logistic_sort);
    let arrayaddress: Vec<usize> = logistic_data.into_iter().map(|x| x.1).collect();
    
    let mut result = vec![0u8; img_data.len()];
    
    for i in 0..width {
        let m = arrayaddress[i];
        for j in 0..height {
            let src_idx = (m + j * width) << 2; // 位运算替代乘法
            let dest_idx = (i + j * width) << 2; // 位运算替代乘法
            
            if src_idx + 3 < img_data.len() && dest_idx + 3 < result.len() {
                result[dest_idx] = img_data[src_idx];
                result[dest_idx + 1] = img_data[src_idx + 1];
                result[dest_idx + 2] = img_data[src_idx + 2];
                result[dest_idx + 3] = img_data[src_idx + 3];
            }
        }
    }
    
    result
}

// PE1模式 - 解密
fn decrypt_pe1(img_data: &[u8], width: usize, height: usize, key2: f64) -> Vec<u8> {
    let mut logistic_data = produce_logistic(key2, width);
    logistic_data.sort_by(produce_logistic_sort);
    let arrayaddress: Vec<usize> = logistic_data.into_iter().map(|x| x.1).collect();
    
    let mut result = vec![0u8; img_data.len()];
    
    for i in 0..width {
        let m = arrayaddress[i];
        for j in 0..height {
            let src_idx = (i + j * width) << 2; // 位运算替代乘法
            let dest_idx = (m + j * width) << 2; // 位运算替代乘法
            
            if src_idx + 3 < img_data.len() && dest_idx + 3 < result.len() {
                result[dest_idx] = img_data[src_idx];
                result[dest_idx + 1] = img_data[src_idx + 1];
                result[dest_idx + 2] = img_data[src_idx + 2];
                result[dest_idx + 3] = img_data[src_idx + 3];
            }
        }
    }
    
    result
}

// PE2模式 - 行+列混淆
fn encrypt_pe2(img_data: &[u8], width: usize, height: usize, key2: f64) -> Vec<u8> {
    let mut x = key2;
    let mut oimgdata = vec![0u8; img_data.len()];
    let mut o2imgdata = vec![0u8; img_data.len()];

    // 行混淆
    for j in 0..height {
        let arrayaddress = produce_logistic(x, width);
        x = arrayaddress[width - 1].0;
        let mut sorted_addresses: Vec<(f64, usize)> = arrayaddress.clone();
        sorted_addresses.sort_by(produce_logistic_sort);
        let sorted_indices: Vec<usize> = sorted_addresses.into_iter().map(|a| a.1).collect();
        
        for i in 0..width {
            let m = sorted_indices[i];
            let src_idx = (m + j * width) << 2; // 位运算替代乘法
            let dest_idx = (i + j * width) << 2; // 位运算替代乘法
            
            if src_idx + 3 < img_data.len() && dest_idx + 3 < oimgdata.len() {
                oimgdata[dest_idx] = img_data[src_idx];
                oimgdata[dest_idx + 1] = img_data[src_idx + 1];
                oimgdata[dest_idx + 2] = img_data[src_idx + 2];
                oimgdata[dest_idx + 3] = img_data[src_idx + 3];
            }
        }
    }

    // 列混淆
    x = key2;
    for i in 0..width {
        let arrayaddress = produce_logistic(x, height);
        x = arrayaddress[height - 1].0;
        let mut sorted_addresses: Vec<(f64, usize)> = arrayaddress.clone();
        sorted_addresses.sort_by(produce_logistic_sort);
        let sorted_indices: Vec<usize> = sorted_addresses.into_iter().map(|a| a.1).collect();
        
        for j in 0..height {
            let n = sorted_indices[j];
            let src_idx = (i + n * width) << 2; // 位运算替代乘法
            let dest_idx = (i + j * width) << 2; // 位运算替代乘法
            
            if src_idx + 3 < oimgdata.len() && dest_idx + 3 < o2imgdata.len() {
                o2imgdata[dest_idx] = oimgdata[src_idx];
                o2imgdata[dest_idx + 1] = oimgdata[src_idx + 1];
                o2imgdata[dest_idx + 2] = oimgdata[src_idx + 2];
                o2imgdata[dest_idx + 3] = oimgdata[src_idx + 3];
            }
        }
    }

    o2imgdata
}

// PE2模式 - 解密
fn decrypt_pe2(img_data: &[u8], width: usize, height: usize, key2: f64) -> Vec<u8> {
    let x = key2;
    let mut oimgdata = vec![0u8; img_data.len()];
    let mut o2imgdata = vec![0u8; img_data.len()];

    // 逆列混淆
    let mut col_x_values = Vec::new();
    let mut current_x = x;
    for _i in 0..width {
        col_x_values.push(current_x);
        let arrayaddress = produce_logistic(current_x, height);
        current_x = arrayaddress[height - 1].0;
    }
    
    // 按逆序进行列解密
    for i in (0..width).rev() {
        let arrayaddress = produce_logistic(col_x_values[i], height);
        let mut sorted_addresses: Vec<(f64, usize)> = arrayaddress.clone();
        sorted_addresses.sort_by(produce_logistic_sort);
        let sorted_indices: Vec<usize> = sorted_addresses.into_iter().map(|a| a.1).collect();
        
        for j in 0..height {
            let n = sorted_indices[j];
            let src_idx = (i + j * width) << 2;
            let dest_idx = (i + n * width) << 2;
            
            if src_idx + 3 < img_data.len() && dest_idx + 3 < oimgdata.len() {
                oimgdata[dest_idx] = img_data[src_idx];
                oimgdata[dest_idx + 1] = img_data[src_idx + 1];
                oimgdata[dest_idx + 2] = img_data[src_idx + 2];
                oimgdata[dest_idx + 3] = img_data[src_idx + 3];
            }
        }
    }

    // 逆行混淆
    let mut row_x_values = Vec::new();
    current_x = x;
    for _j in 0..height {
        row_x_values.push(current_x);
        let arrayaddress = produce_logistic(current_x, width);
        current_x = arrayaddress[width - 1].0;
    }
    
    // 按逆序进行行解密
    for j in (0..height).rev() {
        let arrayaddress = produce_logistic(row_x_values[j], width);
        let mut sorted_addresses: Vec<(f64, usize)> = arrayaddress.clone();
        sorted_addresses.sort_by(produce_logistic_sort);
        let sorted_indices: Vec<usize> = sorted_addresses.into_iter().map(|a| a.1).collect();
        
        for i in 0..width {
            let m = sorted_indices[i];
            let src_idx = (i + j * width) << 2;
            let dest_idx = (m + j * width) << 2;
            
            if src_idx + 3 < oimgdata.len() && dest_idx + 3 < o2imgdata.len() {
                o2imgdata[dest_idx] = oimgdata[src_idx];
                o2imgdata[dest_idx + 1] = oimgdata[src_idx + 1];
                o2imgdata[dest_idx + 2] = oimgdata[src_idx + 2];
                o2imgdata[dest_idx + 3] = oimgdata[src_idx + 3];
            }
        }
    }

    o2imgdata
}

// 小番茄模式 - 加密 (使用JavaScript生成的Gilbert曲线)
// fn encrypt_xiao_fan_qie_with_curve(img_data: &[u8], width: usize, height: usize, curve_data: &[u32]) -> Vec<u8> {
//     let offset = (((5.0f64.sqrt() - 1.0) / 2.0) * (width * height) as f64).round() as usize;
//     let mut result = vec![0u8; img_data.len()];
//     
//     // 将一维曲线数据转换为二维坐标
//     let curve: Vec<(usize, usize)> = curve_data.chunks(2)
//         .map(|chunk| (chunk[0] as usize, chunk[1] as usize))
//         .collect();
//     
//     for i in 0..(width * height) {
//         let (old_x, old_y) = curve[i];
//         let (new_x, new_y) = curve[(i + offset) % (width * height)];
//         let old_pos = (old_x + old_y * width) << 2; // 位运算替代乘法
//         let new_pos = (new_x + new_y * width) << 2; // 位运算替代乘法
//         
//         // 更安全的边界检查
//         if old_pos + 3 < img_data.len() && new_pos + 3 < result.len() {
//             result[new_pos] = img_data[old_pos];
//             result[new_pos + 1] = img_data[old_pos + 1];
//             result[new_pos + 2] = img_data[old_pos + 2];
//             result[new_pos + 3] = img_data[old_pos + 3];
//         } else {
//             // 如果越界，跳过这个像素
//             continue;
//         }
//     }
//     
//     result
// }

// 小番茄模式 - 加密 (保持原有的内部生成曲线版本)
// fn encrypt_xiao_fan_qie(img_data: &[u8], width: usize, height: usize) -> Vec<u8> {
//     let curve = generate_gilbert_curve(width, height);
//     let offset = (((5.0f64.sqrt() - 1.0) / 2.0) * (width * height) as f64).round() as usize;
//     let mut result = vec![0u8; img_data.len()];
//     
//     for i in 0..(width * height) {
//         let (old_x, old_y) = curve[i];
//         let (new_x, new_y) = curve[(i + offset) % (width * height)];
//         let old_pos = (old_x + old_y * width) << 2; // 位运算替代乘法
//         let new_pos = (new_x + new_y * width) << 2; // 位运算替代乘法
//         
//         // 更安全的边界检查
//         if old_pos + 3 < img_data.len() && new_pos + 3 < result.len() {
//             result[new_pos] = img_data[old_pos];
//             result[new_pos + 1] = img_data[old_pos + 1];
//             result[new_pos + 2] = img_data[old_pos + 2];
//             result[new_pos + 3] = img_data[old_pos + 3];
//         } else {
//             // 如果越界，跳过这个像素
//             continue;
//         }
//     }
//     
//     result
// }

// // 小番茄模式 - 解密 (使用JavaScript生成的Gilbert曲线)
// fn decrypt_xiao_fan_qie_with_curve(img_data: &[u8], width: usize, height: usize, curve_data: &[u32]) -> Vec<u8> {
//     let offset = (((5.0f64.sqrt() - 1.0) / 2.0) * (width * height) as f64).round() as usize;
//     let mut result = vec![0u8; img_data.len()];
//     
//     // 将一维曲线数据转换为二维坐标
//     let curve: Vec<(usize, usize)> = curve_data.chunks(2)
//         .map(|chunk| (chunk[0] as usize, chunk[1] as usize))
//         .collect();
//     
//     for i in 0..(width * height) {
//         let (old_x, old_y) = curve[i];
//         let (new_x, new_y) = curve[(i + offset) % (width * height)];
//         let old_pos = (old_x + old_y * width) << 2; // 位运算替代乘法
//         let new_pos = (new_x + new_y * width) << 2; // 位运算替代乘法
//         
//         // 更安全的边界检查
//         if old_pos + 3 < img_data.len() && new_pos + 3 < result.len() {
//             // 解密时，数据流向与加密相反
//             result[old_pos] = img_data[new_pos];
//             result[old_pos + 1] = img_data[new_pos + 1];
//             result[old_pos + 2] = img_data[new_pos + 2];
//             result[old_pos + 3] = img_data[new_pos + 3];
//         } else {
//             // 如果越界，跳过这个像素
//             continue;
//         }
//     }
//     
//     result
// }

// // 小番茄模式 - 解密 (保持原有的内部生成曲线版本)
// fn decrypt_xiao_fan_qie(img_data: &[u8], width: usize, height: usize) -> Vec<u8> {
//     let curve = generate_gilbert_curve(width, height);
//     let offset = (((5.0f64.sqrt() - 1.0) / 2.0) * (width * height) as f64).round() as usize;
//     let mut result = vec![0u8; img_data.len()];
//     
//     for i in 0..(width * height) {
//         let (old_x, old_y) = curve[i];
//         let (new_x, new_y) = curve[(i + offset) % (width * height)];
//         let old_pos = (old_x + old_y * width) << 2; // 位运算替代乘法
//         let new_pos = (new_x + new_y * width) << 2; // 位运算替代乘法
//         
//         // 更安全的边界检查
//         if old_pos + 3 < img_data.len() && new_pos + 3 < result.len() {
//             // 解密时，数据流向与加密相反
//             result[old_pos] = img_data[new_pos];
//             result[old_pos + 1] = img_data[new_pos + 1];
//             result[old_pos + 2] = img_data[new_pos + 2];
//             result[old_pos + 3] = img_data[new_pos + 3];
//         } else {
//             // 如果越界，跳过这个像素
//             continue;
//         }
//     }
//     
//     result
// }

// // 小番茄模式 - 多次加密 (使用JavaScript生成的Gilbert曲线)
// fn encrypt_xiao_fan_qie_multiple_with_curve(img_data: &[u8], width: usize, height: usize, count: usize, curve_data: &[u32]) -> Vec<u8> {
//     let base_offset = (((5.0f64.sqrt() - 1.0) / 2.0) * (width * height) as f64).round() as usize;
//     let total_offset = (base_offset * count) % (width * height);
//     let mut result = vec![0u8; img_data.len()];
//     
//     // 将一维曲线数据转换为二维坐标
//     let curve: Vec<(usize, usize)> = curve_data.chunks(2)
//         .map(|chunk| (chunk[0] as usize, chunk[1] as usize))
//         .collect();
//     
//     for i in 0..(width * height) {
//         let (old_x, old_y) = curve[i];
//         let (new_x, new_y) = curve[(i + total_offset) % (width * height)];
//         let old_pos = (old_x + old_y * width) << 2; // 位运算替代乘法
//         let new_pos = (new_x + new_y * width) << 2; // 位运算替代乘法
//         
//         // 更安全的边界检查
//         if old_pos + 3 < img_data.len() && new_pos + 3 < result.len() {
//             result[new_pos] = img_data[old_pos];
//             result[new_pos + 1] = img_data[old_pos + 1];
//             result[new_pos + 2] = img_data[old_pos + 2];
//             result[new_pos + 3] = img_data[old_pos + 3];
//         } else {
//             // 如果越界，跳过这个像素
//             continue;
//         }
//     }
//     
//     result
// }

// // 小番茄模式 - 多次加密 (保持原有的内部生成曲线版本)
// fn encrypt_xiao_fan_qie_multiple(img_data: &[u8], width: usize, height: usize, count: usize) -> Vec<u8> {
//     let curve = generate_gilbert_curve(width, height);
//     let base_offset = (((5.0f64.sqrt() - 1.0) / 2.0) * (width * height) as f64).round() as usize;
//     let total_offset = (base_offset * count) % (width * height);
//     let mut result = vec![0u8; img_data.len()];
//     
//     for i in 0..(width * height) {
//         let (old_x, old_y) = curve[i];
//         let (new_x, new_y) = curve[(i + total_offset) % (width * height)];
//         let old_pos = (old_x + old_y * width) << 2; // 位运算替代乘法
//         let new_pos = (new_x + new_y * width) << 2; // 位运算替代乘法
//         
//         // 更安全的边界检查
//         if old_pos + 3 < img_data.len() && new_pos + 3 < result.len() {
//             result[new_pos] = img_data[old_pos];
//             result[new_pos + 1] = img_data[old_pos + 1];
//             result[new_pos + 2] = img_data[old_pos + 2];
//             result[new_pos + 3] = img_data[old_pos + 3];
//         } else {
//             // 如果越界，跳过这个像素
//             continue;
//         }
//     }
//     
//     result
// }

// // 小番茄模式 - 多次解密 (使用JavaScript生成的Gilbert曲线)
// fn decrypt_xiao_fan_qie_multiple_with_curve(img_data: &[u8], width: usize, height: usize, count: usize, curve_data: &[u32]) -> Vec<u8> {
//     let base_offset = (((5.0f64.sqrt() - 1.0) / 2.0) * (width * height) as f64).round() as usize;
//     let total_offset = (base_offset * count) % (width * height);
//     let mut result = vec![0u8; img_data.len()];
//     
//     // 将一维曲线数据转换为二维坐标
//     let curve: Vec<(usize, usize)> = curve_data.chunks(2)
//         .map(|chunk| (chunk[0] as usize, chunk[1] as usize))
//         .collect();
//     
//     for i in 0..(width * height) {
//         let (old_x, old_y) = curve[i];
//         let (new_x, new_y) = curve[(i + total_offset) % (width * height)];
//         let old_pos = (old_x + old_y * width) << 2; // 位运算替代乘法
//         let new_pos = (new_x + new_y * width) << 2; // 位运算替代乘法
//         
//         // 更安全的边界检查
//         if old_pos + 3 < img_data.len() && new_pos + 3 < result.len() {
//             // 解密时，数据流向与加密相反
//             result[old_pos] = img_data[new_pos];
//             result[old_pos + 1] = img_data[new_pos + 1];
//             result[old_pos + 2] = img_data[new_pos + 2];
//             result[old_pos + 3] = img_data[new_pos + 3];
//         } else {
//             // 如果越界，跳过这个像素
//             continue;
//         }
//     }
//     
//     result
// }

// // 小番茄模式 - 多次解密 (保持原有的内部生成曲线版本)
// fn decrypt_xiao_fan_qie_multiple(img_data: &[u8], width: usize, height: usize, count: usize) -> Vec<u8> {
//     let curve = generate_gilbert_curve(width, height);
//     let base_offset = (((5.0f64.sqrt() - 1.0) / 2.0) * (width * height) as f64).round() as usize;
//     let total_offset = (base_offset * count) % (width * height);
//     let mut result = vec![0u8; img_data.len()];
//     
//     for i in 0..(width * height) {
//         let (old_x, old_y) = curve[i];
//         let (new_x, new_y) = curve[(i + total_offset) % (width * height)];
//         let old_pos = (old_x + old_y * width) << 2; // 位运算替代乘法
//         let new_pos = (new_x + new_y * width) << 2; // 位运算替代乘法
//         
//         // 更安全的边界检查
//         if old_pos + 3 < img_data.len() && new_pos + 3 < result.len() {
//             // 解密时，数据流向与加密相反
//             result[old_pos] = img_data[new_pos];
//             result[old_pos + 1] = img_data[new_pos + 1];
//             result[old_pos + 2] = img_data[new_pos + 2];
//             result[old_pos + 3] = img_data[new_pos + 3];
//         } else {
//             // 如果越界，跳过这个像素
//             continue;
//         }
//     }
//     
//     result
// }
// 多次加密函数
fn encrypt_b2_multiple(img_data: &[u8], width: usize, height: usize, key: &str, count: usize, sx: usize, sy: usize) -> (Vec<u8>, usize, usize) {
    let mut wid = width;
    let mut hit = height;
    while wid % sx > 0 { wid += 1; }
    while hit % sy > 0 { hit += 1; }
    
    let mut result_data = img_data.to_vec();
    let mut current_width = width;
    let mut current_height = height;
    
    for _ in 0..count {
        let (encrypted, new_width, new_height) = encrypt_b2(&result_data, current_width, current_height, key, sx, sy);
        result_data = encrypted;
        current_width = new_width;
        current_height = new_height;
    }
    (result_data, current_width, current_height)
}

fn encrypt_c_multiple(img_data: &[u8], width: usize, height: usize, key: &str, count: usize) -> Vec<u8> {
    let mut result_data = img_data.to_vec();
    for _ in 0..count {
        result_data = encrypt_c(&result_data, width, height, key);
    }
    result_data
}

fn encrypt_c2_multiple(img_data: &[u8], width: usize, height: usize, key: &str, count: usize) -> Vec<u8> {
    let mut result_data = img_data.to_vec();
    for _ in 0..count {
        result_data = encrypt_c2(&result_data, width, height, key);
    }
    result_data
}

fn encrypt_pe1_multiple(img_data: &[u8], width: usize, height: usize, key2: f64, count: usize) -> Vec<u8> {
    let mut result_data = img_data.to_vec();
    for _ in 0..count {
        result_data = encrypt_pe1(&result_data, width, height, key2);
    }
    result_data
}

fn encrypt_pe2_multiple(img_data: &[u8], width: usize, height: usize, key2: f64, count: usize) -> Vec<u8> {
    let mut result_data = img_data.to_vec();
    for _ in 0..count {
        result_data = encrypt_pe2(&result_data, width, height, key2);
    }
    result_data
}

// 多次解密函数
fn decrypt_b2_multiple(img_data: &[u8], width: usize, height: usize, key: &str, count: usize, sx: usize, sy: usize) -> (Vec<u8>, usize, usize) {
    let mut wid = width;
    let mut hit = height;
    while wid % sx > 0 { wid += 1; }
    while hit % sy > 0 { hit += 1; }
    
    let mut result_data = img_data.to_vec();
    let mut current_width = width;
    let mut current_height = height;
    
    for _ in 0..count {
        let (decrypted, new_width, new_height) = decrypt_b2(&result_data, current_width, current_height, key, sx, sy);
        result_data = decrypted;
        current_width = new_width;
        current_height = new_height;
    }
    (result_data, current_width, current_height)
}

fn decrypt_c_multiple(img_data: &[u8], width: usize, height: usize, key: &str, count: usize) -> Vec<u8> {
    let mut result_data = img_data.to_vec();
    for _ in 0..count {
        result_data = decrypt_c(&result_data, width, height, key);
    }
    result_data
}

fn decrypt_c2_multiple(img_data: &[u8], width: usize, height: usize, key: &str, count: usize) -> Vec<u8> {
    let mut result_data = img_data.to_vec();
    for _ in 0..count {
        result_data = decrypt_c2(&result_data, width, height, key);
    }
    result_data
}

fn decrypt_pe1_multiple(img_data: &[u8], width: usize, height: usize, key2: f64, count: usize) -> Vec<u8> {
    let mut result_data = img_data.to_vec();
    for _ in 0..count {
        result_data = decrypt_pe1(&result_data, width, height, key2);
    }
    result_data
}

fn decrypt_pe2_multiple(img_data: &[u8], width: usize, height: usize, key2: f64, count: usize) -> Vec<u8> {
    let mut result_data = img_data.to_vec();
    for _ in 0..count {
        result_data = decrypt_pe2(&result_data, width, height, key2);
    }
    result_data
}

#[wasm_bindgen]
pub fn encrypt_image_multiple(
    image_data: &ImageData,
    width: u32,
    height: u32,
    mode: &str,
    key: &str,
    key2: f64,
    count: u32,
    sx: u32,
    sy: u32
) -> ImageData {
    let data = image_data.data();
    let data_vec: Vec<u8> = data.to_vec();
    let width = width as usize;
    let height = height as usize;
    let sx = sx as usize;
    let sy = sy as usize;
    let count = count as usize;
    
    let (result_data, result_width, result_height) = match mode {
        "b" => {
            if count == 1 {
                let (encrypted, new_width, new_height) = encrypt_b2(&data_vec, width, height, key, sx, sy);
                (encrypted, new_width, new_height)
            } else {
                encrypt_b2_multiple(&data_vec, width, height, key, count, sx, sy)
            }
        },
        "c" => {
            if count == 1 {
                let encrypted = encrypt_c(&data_vec, width, height, key);
                (encrypted, width, height)
            } else {
                let encrypted = encrypt_c_multiple(&data_vec, width, height, key, count);
                (encrypted, width, height)
            }
        },
        "c2" => {
            if count == 1 {
                let encrypted = encrypt_c2(&data_vec, width, height, key);
                (encrypted, width, height)
            } else {
                let encrypted = encrypt_c2_multiple(&data_vec, width, height, key, count);
                (encrypted, width, height)
            }
        },
        "pe1" => {
            if count == 1 {
                let encrypted = encrypt_pe1(&data_vec, width, height, key2);
                (encrypted, width, height)
            } else {
                let encrypted = encrypt_pe1_multiple(&data_vec, width, height, key2, count);
                (encrypted, width, height)
            }
        },
        "pe2" => {
            if count == 1 {
                let encrypted = encrypt_pe2(&data_vec, width, height, key2);
                (encrypted, width, height)
            } else {
                let encrypted = encrypt_pe2_multiple(&data_vec, width, height, key2, count);
                (encrypted, width, height)
            }
        },
        // "xfq" => {
        //     if count == 1 {
        //         let encrypted = encrypt_xiao_fan_qie(&data_vec, width, height);
        //         (encrypted, width, height)
        //     } else {
        //         let encrypted = encrypt_xiao_fan_qie_multiple(&data_vec, width, height, count);
        //         (encrypted, width, height)
        //     }
        // },
        _ => {
            // 默认使用C2模式
            if count == 1 {
                let encrypted = encrypt_c2(&data_vec, width, height, key);
                (encrypted, width, height)
            } else {
                let encrypted = encrypt_c2_multiple(&data_vec, width, height, key, count);
                (encrypted, width, height)
            }
        }
    };
    
    // 创建新的Uint8ClampedArray
    let result_array = Uint8ClampedArray::new_with_length(result_data.len() as u32);
    for (i, &byte) in result_data.iter().enumerate() {
        result_array.set_index(i as u32, byte);
    }
    
    // 创建并返回新的ImageData
    // let clamped_data = js_sys::Uint8ClampedArray::from(result_data.as_slice());
    let new_image_data = web_sys::ImageData::new_with_u8_clamped_array_and_sh(
        wasm_bindgen::Clamped(&result_data),
        result_width as u32,
        result_height as u32,
    ).unwrap_or(image_data.clone()); // 如果创建失败，回退到原始数据
    
    new_image_data
}

// // 新增：使用JavaScript生成的Gilbert曲线进行小番茄模式加密
// #[wasm_bindgen]
// pub fn encrypt_xiao_fan_qie_with_curve_js(
//     image_data: &ImageData,
//     width: u32,
//     height: u32,
//     curve_data: &[u32],
// ) -> ImageData {
//     let data = image_data.data();
//     let data_vec: Vec<u8> = data.to_vec();
//     let width = width as usize;
//     let height = height as usize;
//     
//     let result_data = encrypt_xiao_fan_qie_with_curve(&data_vec, width, height, curve_data);
//     
//     // 创建并返回新的ImageData
//     let new_image_data = web_sys::ImageData::new_with_u8_clamped_array_and_sh(
//         wasm_bindgen::Clamped(&result_data),
//         width as u32,
//         height as u32,
//     ).unwrap_or(image_data.clone()); // 如果创建失败，回退到原始数据
//     
//     new_image_data
// }

// // 新增：使用JavaScript生成的Gilbert曲线进行小番茄模式多次加密
// #[wasm_bindgen]
// pub fn encrypt_xiao_fan_qie_multiple_with_curve_js(
//     image_data: &ImageData,
//     width: u32,
//     height: u32,
//     count: u32,
//     curve_data: &[u32],
// ) -> ImageData {
//     let data = image_data.data();
//     let data_vec: Vec<u8> = data.to_vec();
//     let width = width as usize;
//     let height = height as usize;
//     let count = count as usize;
//     
//     let result_data = encrypt_xiao_fan_qie_multiple_with_curve(&data_vec, width, height, count, curve_data);
//     
//     // 创建并返回新的ImageData
//     let new_image_data = web_sys::ImageData::new_with_u8_clamped_array_and_sh(
//         wasm_bindgen::Clamped(&result_data),
//         width as u32,
//         height as u32,
//     ).unwrap_or(image_data.clone()); // 如果创建失败，回退到原始数据
//     
//     new_image_data
// }

#[wasm_bindgen]
pub fn decrypt_image_multiple(
    image_data: &ImageData,
    width: u32,
    height: u32,
    mode: &str,
    key: &str,
    key2: f64,
    count: u32,
    sx: u32,
    sy: u32
) -> ImageData {
    let data = image_data.data();
    let data_vec: Vec<u8> = data.to_vec();
    let width = width as usize;
    let height = height as usize;
    let sx = sx as usize;
    let sy = sy as usize;
    let count = count as usize;
    
    let (result_data, result_width, result_height) = match mode {
        "b" => {
            if count == 1 {
                let (decrypted, new_width, new_height) = decrypt_b2(&data_vec, width, height, key, sx, sy);
                (decrypted, new_width, new_height)
            } else {
                decrypt_b2_multiple(&data_vec, width, height, key, count, sx, sy)
            }
        },
        "c" => {
            if count == 1 {
                let decrypted = decrypt_c(&data_vec, width, height, key);
                (decrypted, width, height)
            } else {
                let decrypted = decrypt_c_multiple(&data_vec, width, height, key, count);
                (decrypted, width, height)
            }
        },
        "c2" => {
            if count == 1 {
                let decrypted = decrypt_c2(&data_vec, width, height, key);
                (decrypted, width, height)
            } else {
                let decrypted = decrypt_c2_multiple(&data_vec, width, height, key, count);
                (decrypted, width, height)
            }
        },
        "pe1" => {
            if count == 1 {
                let decrypted = decrypt_pe1(&data_vec, width, height, key2);
                (decrypted, width, height)
            } else {
                let decrypted = decrypt_pe1_multiple(&data_vec, width, height, key2, count);
                (decrypted, width, height)
            }
        },
        "pe2" => {
            if count == 1 {
                let decrypted = decrypt_pe2(&data_vec, width, height, key2);
                (decrypted, width, height)
            } else {
                let decrypted = decrypt_pe2_multiple(&data_vec, width, height, key2, count);
                (decrypted, width, height)
            }
        },
        // "xfq" => {
        //     if count == 1 {
        //         let decrypted = decrypt_xiao_fan_qie(&data_vec, width, height);
        //         (decrypted, width, height)
        //     } else {
        //         let decrypted = decrypt_xiao_fan_qie_multiple(&data_vec, width, height, count);
        //         (decrypted, width, height)
        //     }
        // },
        _ => {
            // 默认使用C2模式
            if count == 1 {
                let decrypted = decrypt_c2(&data_vec, width, height, key);
                (decrypted, width, height)
            } else {
                let decrypted = decrypt_c2_multiple(&data_vec, width, height, key, count);
                (decrypted, width, height)
            }
        }
    };
    
    // 创建新的Uint8ClampedArray
    let result_array = Uint8ClampedArray::new_with_length(result_data.len() as u32);
    for (i, &byte) in result_data.iter().enumerate() {
        result_array.set_index(i as u32, byte);
    }
    
    // 创建并返回新的ImageData
    let new_image_data = web_sys::ImageData::new_with_u8_clamped_array_and_sh(
        wasm_bindgen::Clamped(&result_data),
        result_width as u32,
        result_height as u32,
    ).unwrap_or(image_data.clone()); // 如果创建失败，回退到原始数据
    
    new_image_data
}

// // 新增：使用JavaScript生成的Gilbert曲线进行小番茄模式解密
// #[wasm_bindgen]
// pub fn decrypt_xiao_fan_qie_with_curve_js(
//     image_data: &ImageData,
//     width: u32,
//     height: u32,
//     curve_data: &[u32],
// ) -> ImageData {
//     let data = image_data.data();
//     let data_vec: Vec<u8> = data.to_vec();
//     let width = width as usize;
//     let height = height as usize;
//     
//     let result_data = decrypt_xiao_fan_qie_with_curve(&data_vec, width, height, curve_data);
//     
//     // 创建并返回新的ImageData
//     let new_image_data = web_sys::ImageData::new_with_u8_clamped_array_and_sh(
//         wasm_bindgen::Clamped(&result_data),
//         width as u32,
//         height as u32,
//     ).unwrap_or(image_data.clone()); // 如果创建失败，回退到原始数据
//     
//     new_image_data
// }

// // 新增：使用JavaScript生成的Gilbert曲线进行小番茄模式多次解密
// #[wasm_bindgen]
// pub fn decrypt_xiao_fan_qie_multiple_with_curve_js(
//     image_data: &ImageData,
//     width: u32,
//     height: u32,
//     count: u32,
//     curve_data: &[u32],
// ) -> ImageData {
//     let data = image_data.data();
//     let data_vec: Vec<u8> = data.to_vec();
//     let width = width as usize;
//     let height = height as usize;
//     let count = count as usize;
//     
//     let result_data = decrypt_xiao_fan_qie_multiple_with_curve(&data_vec, width, height, count, curve_data);
//     
//     // 创建并返回新的ImageData
//     let new_image_data = web_sys::ImageData::new_with_u8_clamped_array_and_sh(
//         wasm_bindgen::Clamped(&result_data),
//         width as u32,
//         height as u32,
//     ).unwrap_or(image_data.clone()); // 如果创建失败，回退到原始数据
//     
//     new_image_data
// }