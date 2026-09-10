package uz.mahmud.ismlarkitobi.adapter;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Filter;
import android.widget.Filterable;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

import uz.mahmud.ismlarkitobi.DetailActivity;
import uz.mahmud.ismlarkitobi.R;
import uz.mahmud.ismlarkitobi.model.Model;

public class NameAdapter extends RecyclerView.Adapter<NameAdapter.ViewHolder> implements Filterable {

    private Context context;
    private ArrayList<Model> list;
    private ArrayList<Model> fullList;
    private OnItemLongClick listener;

    public NameAdapter(Context context, ArrayList<Model> list,OnItemLongClick listener) {
        this.context = context;
        this.list = list;
        this.fullList = new ArrayList<>(list);
        this.listener=listener;
    }
    public interface OnItemLongClick{
        void onLongClick(Model model);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_name, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {

        Model model = list.get(position);

        holder.txtName.setText(model.getName());
        holder.txtGender.setText(model.getGender());

        holder.itemView.setOnClickListener(v -> {

            Intent intent = new Intent(context, DetailActivity.class);

            intent.putExtra("name", model.getName());
            intent.putExtra("gender", model.getGender());
            intent.putExtra("desc", model.getDesc());
            intent.putExtra("nomid", model.getNomid());

            context.startActivity(intent);

        });

        holder.itemView.setOnLongClickListener(v -> {

            listener.onLongClick(model);

            return true;
        });
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        TextView txtName, txtGender;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            txtName = itemView.findViewById(R.id.txtName);
            txtGender = itemView.findViewById(R.id.txtGender);
        }
    }
    @Override
    public Filter getFilter() {
        return filter;
    }
    public void updateData(ArrayList<Model> newList) {
        list.clear();
        list.addAll(newList);

        fullList.clear();
        fullList.addAll(newList);

        notifyDataSetChanged();
    }

    private final Filter filter = new Filter() {

        @Override
        protected FilterResults performFiltering(CharSequence constraint) {

            ArrayList<Model> filteredList = new ArrayList<>();

            if (constraint == null || constraint.length() == 0) {

                filteredList.addAll(fullList);

            } else {

                String filterPattern = constraint.toString().toLowerCase().trim();

                for (Model item : fullList) {

                    if (item.getName() != null &&
                            item.getName().toLowerCase().contains(filterPattern)) {
                        filteredList.add(item);
                    }
                }
            }

            FilterResults results = new FilterResults();
            results.values = filteredList;
            return results;
        }

        @Override
        protected void publishResults(CharSequence constraint, FilterResults results) {

            list.clear();
            list.addAll((ArrayList<Model>) results.values);
            notifyDataSetChanged();
        }
    };
}