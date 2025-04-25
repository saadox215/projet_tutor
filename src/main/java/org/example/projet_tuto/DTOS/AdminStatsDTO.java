package org.example.projet_tuto.DTOS;


import java.util.Objects;

public class AdminStatsDTO {
    private long totalUsers;
    private long totalStudents;
    private long totalProfessors;
    private long totalClasses;

    public AdminStatsDTO() {}

    private AdminStatsDTO(long totalUsers, long totalStudents,
                          long totalProfessors, long totalClasses) {
        this.totalUsers = totalUsers;
        this.totalStudents = totalStudents;
        this.totalProfessors = totalProfessors;
        this.totalClasses = totalClasses;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public long getTotalProfessors() {
        return totalProfessors;
    }

    public long getTotalClasses() {
        return totalClasses;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public void setTotalProfessors(long totalProfessors) {
        this.totalProfessors = totalProfessors;
    }

    public void setTotalClasses(long totalClasses) {
        this.totalClasses = totalClasses;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AdminStatsDTO that = (AdminStatsDTO) o;
        return totalUsers == that.totalUsers &&
                totalStudents == that.totalStudents &&
                totalProfessors == that.totalProfessors &&
                totalClasses == that.totalClasses;
    }

    @Override
    public int hashCode() {
        return Objects.hash(totalUsers, totalStudents, totalProfessors, totalClasses);
    }

    // toString()
    @Override
    public String toString() {
        return "AdminStatsDTO{" +
                "totalUsers=" + totalUsers +
                ", totalStudents=" + totalStudents +
                ", totalProfessors=" + totalProfessors +
                ", totalClasses=" + totalClasses +
                '}';
    }

    // Builder pattern manuel
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalUsers;
        private long totalStudents;
        private long totalProfessors;
        private long totalClasses;

        public Builder totalUsers(long totalUsers) {
            this.totalUsers = totalUsers;
            return this;
        }

        public Builder totalStudents(long totalStudents) {
            this.totalStudents = totalStudents;
            return this;
        }

        public Builder totalProfessors(long totalProfessors) {
            this.totalProfessors = totalProfessors;
            return this;
        }

        public Builder totalClasses(long totalClasses) {
            this.totalClasses = totalClasses;
            return this;
        }

        public AdminStatsDTO build() {
            return new AdminStatsDTO(totalUsers, totalStudents, totalProfessors, totalClasses);
        }
    }
}
