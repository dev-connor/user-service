import { ok } from "assert"
import axios from "axios"

const API_URL = "http://localhost:3000"

describe("Integration Test - API (Docker, Axios)", () => {
  let memberToken: string
  let adminToken: string
  let memberId: string
  let adminId: string

  const memberSignup = {
    email: "member@gmail.com",
    password: "memberpass",
    name: "Member User",
  }

  const adminSignup = {
    email: "admin@protopie.io",
    password: "adminpass",
    name: "Admin User",
  }

  it("회원 가입 - member", async () => {
    const res = await axios.post(`${API_URL}/signup`, memberSignup)
    expect(res.status).toBe(201)
    memberId = res.data.id
  })

  it("회원 가입 - admin", async () => {
    const res = await axios.post(`${API_URL}/signup`, adminSignup)
    expect(res.status).toBe(201)
    adminId = res.data.id
  })

  it("로그인 - member", async () => {
    const res = await axios.post(`${API_URL}/signin`, {
      email: memberSignup.email,
      password: memberSignup.password,
    })
    expect(res.status).toBeGreaterThanOrEqual(200)
    memberId = res.data.userId
    memberToken = res.data.accessToken
  })

  it("로그인 - admin", async () => {
    const res = await axios.post(`${API_URL}/signin`, {
      email: adminSignup.email,
      password: adminSignup.password,
    })
    expect(res.status).toBeGreaterThanOrEqual(200)
    adminId = res.data.userId
    adminToken = res.data.accessToken
  })

  it("member는 자신의 정보 조회 가능", async () => {
    const res = await axios.get(`${API_URL}/users/${memberId}`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    })
    expect(res.status).toBe(200)
    expect(res.data.email).toBe(memberSignup.email)
  })

  it("member는 admin 정보 조회 불가", async () => {
    try {
      await axios.get(`${API_URL}/users/${adminId}`, {
        headers: { Authorization: `Bearer ${memberToken}` },
      })
    } catch (err: any) {
      expect(err.response.status).toBe(403)
    }
  })

  it("admin은 누구든 정보 조회 가능", async () => {
    const res = await axios.get(`${API_URL}/users/${memberId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
  })

  it("member는 자신의 정보 수정 가능", async () => {
    const res = await axios.put(
      `${API_URL}/users/${memberId}`,
      { name: "Member Updated", password: "password", email: "email@gmail.com" },
      { headers: { Authorization: `Bearer ${memberToken}` } },
    )
    expect(res.status).toBe(200)
  })

  it("member는 admin 정보 수정 불가", async () => {
    try {
      await axios.put(
        `${API_URL}/users/${adminId}`,
        { name: "Hacker" },
        { headers: { Authorization: `Bearer ${memberToken}` } },
      )
    } catch (err: any) {
      expect(err.response.status).toBe(403)
    }
  })

  it("admin은 누구든 정보 수정 가능", async () => {
    const res = await axios.put(
      `${API_URL}/users/${memberId}`,
      { name: "Member Admin Updated", password: "password", email: "email@protopie.io" },
      { headers: { Authorization: `Bearer ${adminToken}` } },
    )
    expect(res.status).toBe(200)
  })

  it("member는 자신의 계정 삭제 가능", async () => {
    const res = await axios.delete(`${API_URL}/users/${memberId}`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    })
    expect(res.status).toBe(200)
  })

  it("member는 admin 계정 삭제 불가", async () => {
    try {
      await axios.delete(`${API_URL}/users/${adminId}`, {
        headers: { Authorization: `Bearer ${memberToken}` },
      })
    } catch (err: any) {
      expect(err.response.status).toBe(403)
    }
  })

  it("admin은 누구든 삭제 가능", async () => {
    const res = await axios.delete(`${API_URL}/users/${adminId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(200)
  })
})
