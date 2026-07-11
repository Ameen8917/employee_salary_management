import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { employeePayload } from "../test/factories.js";

describe("employee API", () => {
  it("supports core CRUD and returns validation errors", async () => {
    const payload = employeePayload({ firstName: "Jordan" });
    const createResponse = await request(app).post("/api/employees").send(payload).expect(201);
    expect(createResponse.body.data.firstName).toBe("Jordan");
    const employeeId = createResponse.body.data.id;

    const listResponse = await request(app).get("/api/employees?search=Jordan&limit=5").expect(200);
    expect(listResponse.body).toMatchObject({ success: true, pagination: { total: 1 } });

    await request(app).patch(`/api/employees/${employeeId}`).send({ department: "Product" }).expect(200);
    await request(app).delete(`/api/employees/${employeeId}`).expect(204);
    await request(app).get(`/api/employees/${employeeId}`).expect(404);

    await request(app).post("/api/employees").send({ firstName: "Missing fields" }).expect(400);
  });
});
