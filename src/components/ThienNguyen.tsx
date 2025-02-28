"use client"

import type React from "react"
import { useState, useEffect } from "react"
import styles from "./GlobalStyle.module.scss"
import {
  Search,
  User,
  Building,
  Loader2,
  AlertCircle,
  Heart,
  Users,
  Gift,
  Calendar,
  MapPin,
  Phone,
  X,
} from "lucide-react"

interface Donor {
  studentId: string
  name: string
  class: string
  faculty: string
}

const ThienNguyen: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([])
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const SPREADSHEET_ID = "17N1t88YJWVWBw78Lk3mvrGu_B5I_xrRz_txMbXuOQtw"
  const RANGE = "Trang tính1!A2:E" // Include all columns A to E
  const API_KEY = "AIzaSyBN--zNtaWdDcWWgqZDGstg3KuZNGEz-Ww"
  const ITEMS_PER_PAGE = 9

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`,
        )

        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu từ Google Sheets")
        }

        const data = await response.json()

        if (!data.values || data.values.length === 0) {
          setDonors([])
          setFilteredDonors([])
          setIsLoading(false)
          return
        }

        const fetchedDonors: Donor[] = data.values.map((row: string[]) => ({
          // Skip the first column (STT) and map the rest correctly
          studentId: row[1] || "N/A", // MSSV is in column B (index 1)
          name: row[2] || "N/A", // Name is in column C (index 2)
          class: row[3] || "N/A", // Class is in column D (index 3)
          faculty: row[4] || "N/A", // Faculty is in column E (index 4)
        }))

        setDonors(fetchedDonors)
        setFilteredDonors(fetchedDonors)
        setIsLoading(false)
      } catch (err) {
        setError("Không thể tải danh sách đóng góp. Vui lòng thử lại sau.")
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchDonors()
  }, [])

  useEffect(() => {
    const filtered = donors.filter(
      (donor) =>
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.faculty.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredDonors(filtered)
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchTerm, donors])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of donor list
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const totalPages = Math.ceil(filteredDonors.length / ITEMS_PER_PAGE)
  const displayedDonors = filteredDonors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleDonateClick = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <div className={styles.thienNguyenContainer}>
      <h1 className={styles.pageTitle}>Danh Sách Nhà Hảo Tâm - Thiện Nguyện Mùa Xuân 2025</h1>

      {/* Stats Section */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{donors.length}</div>
          <div className={styles.statLabel}>Tổng số người đóng góp</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{[...new Set(donors.map((donor) => donor.faculty))].length}</div>
          <div className={styles.statLabel}>Khoa tham gia</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{[...new Set(donors.map((donor) => donor.class))].length}</div>
          <div className={styles.statLabel}>Lớp tham gia</div>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, MSSV, lớp hoặc khoa..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.iconWrapper}>
            <Loader2 size={48} className="animate-spin" />
          </div>
          <p>Đang tải danh sách đóng góp...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <div className={styles.iconWrapper}>
            <AlertCircle size={48} />
          </div>
          <p>{error}</p>
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className={styles.noResultsContainer}>
          <div className={styles.iconWrapper}>
            <Search size={48} />
          </div>
          <p>Không tìm thấy người đóng góp nào phù hợp</p>
        </div>
      ) : (
        <div className={styles.donorList}>
          {displayedDonors.map((donor, index) => (
            <div key={index} className={styles.donorCard}>
              <div className={styles.donorDetails}>
                <p>
                  <div className={styles.iconWrapper}>
                    <User size={18} />
                  </div>
                  <strong>MSSV:</strong> {donor.studentId}
                </p>
                <p>
                  <div className={styles.iconWrapper}>
                    <Heart size={18} />
                  </div>
                  <strong>Họ tên:</strong> {donor.name}
                </p>
                <p>
                  <div className={styles.iconWrapper}>
                    <Users size={18} />
                  </div>
                  <strong>Lớp:</strong> {donor.class}
                </p>
                <p>
                  <div className={styles.iconWrapper}>
                    <Building size={18} />
                  </div>
                  <strong>Khoa:</strong> {donor.faculty}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDonors.length > 0 && (
        <div className={styles.pagination}>
          <button className={styles.pageButton} onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
            &laquo;
          </button>
          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lsaquo;
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Logic to show pages around current page
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <button
                key={i}
                className={`${styles.pageButton} ${currentPage === pageNum ? styles.active : ""}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </button>
          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      )}

      <div className={styles.ctaSection}>
        <h2>Chung Tay Vì Một Mùa Xuân Ấm Áp!</h2>
        <p>
          Mỗi đóng góp của bạn đều có ý nghĩa lớn đối với cộng đồng. Hãy tham gia cùng chúng tôi để mang lại niềm vui và
          hạnh phúc cho những người có hoàn cảnh khó khăn.
        </p>
        <button className={styles.mainCTAButton} onClick={handleDonateClick}>
          <Gift className="mr-2 inline-block" size={20} />
          Quyên Góp Ngay
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              <X size={24} />
            </button>
            <h2 className={styles.modalTitle}>Thông Tin Quyên Góp</h2>

            <div className={styles.modalInfo}>
              <div className={styles.infoItem}>
                <Calendar size={20} className={styles.infoIcon} />
                <div>
                  <strong>Thời gian:</strong> Đến hết ngày 7/3/2025
                </div>
              </div>

              <div className={styles.infoItem}>
                <MapPin size={20} className={styles.infoIcon} />
                <div>
                  <strong>Địa điểm:</strong> Phòng B106, Nhà học B, Trường Đại học Kiên Giang
                </div>
              </div>

              <div className={styles.infoItem}>
                <Phone size={20} className={styles.infoIcon} />
                <div>
                  <strong>Liên hệ:</strong> 0967006704 - Tạ Thành Lộc (chủ nhiệm)
                </div>
              </div>
            </div>

            <button className={styles.confirmButton} onClick={closeModal}>
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThienNguyen

