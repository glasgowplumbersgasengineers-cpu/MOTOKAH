import { staticFile } from "remotion";
import { IconMapPin } from "@tabler/icons-react";
import { COLOR, RADIUS, SHADOW } from "../design";
import { CarPhoto } from "./CarPhoto";

interface VehicleCardProps {
  title: string;
  price: string;
  location: string;
  km: string;
  year: string;
  verified?: boolean;
  style?: React.CSSProperties;
  // Optional — real /public/cars/*.jpg path, e.g. "cars/hilux-white-2019-1.jpg".
  // Omitted (all existing /promo callers): unchanged CarPhoto icon fallback.
  photo?: string;
}

export function VehicleCard({ title, price, location, km, year, verified = true, style, photo }: VehicleCardProps) {
  return (
    <div style={{
      background: COLOR.bg,
      borderRadius: RADIUS.lg,
      border: `1px solid ${COLOR.border}`,
      boxShadow: SHADOW.card,
      overflow: "hidden",
      ...style,
    }}>
      {/* Image area */}
      <div style={{ position: "relative" }}>
        {photo ? (
          <img src={staticFile(photo)} alt="" style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
        ) : (
          <CarPhoto width="100%" height={100} style={{ borderRadius: 0 }} />
        )}
        {verified && (
          <div style={{
            position: "absolute", top: 8, right: 8,
            background: COLOR.bg,
            border: `1px solid ${COLOR.brand}`,
            color: COLOR.brandInk,
            fontSize: 9, fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 20,
            fontFamily: "Inter, sans-serif",
          }}>
            Verified ✓
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{
          fontSize: 14, fontWeight: 700,
          color: COLOR.ink,
          fontFamily: "Inter, sans-serif",
          marginBottom: 4,
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 16, fontWeight: 800,
          color: COLOR.brandInk,
          fontFamily: "Inter, sans-serif",
          marginBottom: 8,
        }}>
          {price}
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 10, color: COLOR.inkMute,
          fontFamily: "Inter, sans-serif",
        }}>
          <IconMapPin size={11} />
          <span>{location}</span>
          <span style={{ color: COLOR.border }}>·</span>
          <span>{km}</span>
          <span style={{ color: COLOR.border }}>·</span>
          <span>{year}</span>
        </div>
      </div>
    </div>
  );
}
